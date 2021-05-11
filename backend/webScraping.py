# -*- coding: utf-8 -*-
"""
Created on Mon Apr 26 14:29:24 2021

@author: simon
"""
# =============================================================================
# INSTALLATION

# pip install bs4
# pip install pymongo
# pip install pandas
# pip install urllib3
# =============================================================================

from urllib.request import Request
from urllib.request import urlopen
from bs4 import BeautifulSoup
import pymongo
import pandas as pd
import time
import sys

def insertLocationDataIntoMongDB(collection):
    data = pd.read_csv("communes.csv")
    data = data[["code_commune_INSEE","nom_commune","code_departement",
                 "nom_departement","longitude","latitude"]]
    data.columns = ["code_commune","nom_commune","code_dep",
                    "nom_dep","longitude","latitude"]
    collection.insert_many(data.to_dict(orient="records"))
    paris = {"code_commune":"75000","nom_commune":"Paris","code_dep":"75",
             "nom_dep":"Paris","longitude":2.33629344655,"latitude":48.8626304852}
    collection.insert_one(paris)

def getUrl(name,num_page):
    url = "https://www.geneanet.org/fonds/individus/?go=1&page="
    url += str(num_page)
    url += "&size=50&nom="
    url += name
    return url

def makeRequest(url):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"})
    html = urlopen(req).read()
    soup = BeautifulSoup(html, 'html.parser')
    return soup

def getInitialData(name):
    return {"name":name.lower(), "events":[]}

def checkNameDoesNotExist(collection,name):
    # Vérifie que le nom entré en paramètre n'existe pas déjà dans MongoDB
    # S'il existe deja, tous ses documents associes sont supprimés
    selection = {"name":name}
    if collection.count_documents(selection) > 0:
        collection.delete_many(selection)

def coverage(collection,total,name):
    # Fonction qui calcule le nombre de données insérées dans MongoDB par
    # rapport au nombre total d'individus trouvés sur geneanet.org
    successes = collection.count_documents({"name":name})
    res = round((successes/total)*100,2)
    return "Coverage : " +str(res) + "% "

# =============================================================================
# Traitement particulier pour chaque type de document
# =============================================================================
def relevesCollaboratifs(soup,data):
    event = {"place" : {"nom_dep":[], "nom_commune":[]}}
    # Evenement (mariage ou deces)
    title = soup.title.string.split(" ")
    label = "Mariage"
    for element in title :
        if element == "Décès" :
            label = element
    event["label"] = label
    # Lieu
    try:
        div_h2 = soup.find("div",{"id": "releve-results"})
        h2 = div_h2.find("h2").text.replace(",","").split(" ")
        for word in h2:
            if word not in ("France","Mariages","Décès","-"):
                event["place"]["nom_dep"].append(word)
                event["place"]["nom_commune"].append(word)
    except:
        print("Balise h2 introuvable")
    # Date
    year = -1
    divs = soup.findAll("div",class_="xlarge-6")
    for div in divs:
        stripped = div.text.strip()
        if len(stripped) == 4 and stripped.isdigit():
            year = int(stripped)
        if len(stripped) == 10 and stripped[-4:].isdigit():
            year = int(stripped[-4:])
        # Code commune
        if len(stripped) == 5 and stripped.isdigit():
            event["place"]["code_commune"] = int(stripped)   
    if year == -1 : 
        return "not enough data" 
    event["date"] = year
    data["events"].append(event)
    return data


def arbreGenealogique(soup,data):
    # Prénom
    span = soup.find("span",class_="gw-individual-info-name-firstname")
    firstnames = span.text.strip()
    data["firstnames"] = firstnames
    # Events
    all_li = soup.find_all('li', class_=False, id=False)
    for li in all_li:
        if li.text[:2] in ("Né","Dé","Ma"):
            li = li.text.replace("France","").replace(" -","").replace(",","").split(" ")
            # Naissance
            if li[0] in ("Né","Née"):
                data["sex"] = ("Homme" if li[0] == "Né" else "Femme")
                event = {"label" : "Naissance", "place" : {"nom_dep":[], "nom_commune":[]}}
                # Date
                year_born = li[1].replace("&nbsp;"," ")[-4:]
                event["date"] = year_born
                # Lieu
                for word in li :
                    try:
                        event["place"]["code_commune"] = str(int(word))
                    except:
                        event["place"]["nom_dep"].append(word)
                        event["place"]["nom_commune"].append(word)
                data["events"].append(event)
    return data

def registres(soup,data):
    title = soup.title.string.split(" ")
    event = {"label" : "inconnu", "place" : {"nom_dep":[], "nom_commune":[]}}
    # Date
    dates = []
    # Lieu
    for element in title:
        if len(element) == 4 and element[0] == "1" and element.isdigit():
            dates.append(int(element))
        elif len(element)>4 and element[-4:].isdigit():
            dates.append(int(element[-4:]))
        elif element[:1] == "(":
            short_element = element[1:len(element)-1]
            event["place"]["nom_dep"].append(short_element)
        elif "/" not in element and len(element) > 2 and not any(char.isdigit() for char in element):
            event["place"]["nom_commune"].append(element)
    # Dates
    if len(dates) == 1 :
        event["date"] = dates[0]
    elif len(dates) == 2 :
        event["date"] = (dates[0] + dates[1]) // 2
    else:
        return "not enough data" # Pas de dates = pas assez de donnees
    data["events"].append(event)
    return data
        
# =============================================================================
# Insertion d'un individu dans MongoDB
# =============================================================================
def insertOnePersonIntoMongoDB(url,bdd,name):
    collecCommunes = bdd["communes"]
    collecPeople = bdd["people"]
    data = getInitialData(name)
    short_url = url[25:43]
    #very_short_url = url[25:35]
    head_url = url[:23]
    if short_url == "releves-collaborat" :
#        data = "not enough data"
        data = relevesCollaboratifs(makeRequest(url),data)
    elif head_url == "https://gw.geneanet.org":
        #data = "not enough data"
        data = arbreGenealogique(makeRequest(url),data)
    elif short_url == "archives/registres":
#        data = "not enough data"
        data = registres(makeRequest(url),data)
    else:
#        print("Unsupported URL")
#        print(url)
        data = "not enough data"
    # Recherche des longitudes et latitudes
    if data != "not enough data" :
        for event in data["events"]:
            try:
                selection = {"code_commune":event["place"]["code_commune"]}
                result = collecCommunes.find_one(selection)
                event["place"]["nom_dep"] = result["nom_dep"]
                event["place"]["nom_commune"] = result["nom_commune"]
                event["place"]["longitude"] = result["longitude"]
                event["place"]["latitude"] = result["latitude"]
            except:
                for dep in event["place"]["nom_dep"]:
                    for commune in event["place"]["nom_commune"]:
                        approx_dep = '^'+dep
                        approx_dep = approx_dep.replace("(","").replace(")","")
                        try:
                            selection = {'nom_dep':{'$regex':approx_dep},"nom_commune":commune}
                            if collecCommunes.count_documents(selection) > 0:
                                result = collecCommunes.find_one(selection)
                                event["place"]["nom_dep"] = result["nom_dep"]
                                event["place"]["nom_commune"] = commune
                                event["place"]["longitude"] = result["longitude"]
                                event["place"]["latitude"] = result["latitude"]
                        except:
                            print("Error Regex")
        # Insertion seulement si les coords GPS ont été trouvées
        longitude = True
        for event in data["events"]:
            if "longitude" not in event["place"].keys(): 
                longitude = False
        if longitude:
            collecPeople.insert_one(data)

                        
# =============================================================================
# Recherche de tous les individus du meme nom
# =============================================================================
def insertPeopleSameNameIntoMongoDB(name):
    # Connexion à MongoDB
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    bdd = client["genealogy"]
    # Insertiron des communes si ce n'est pas deja fait
    collectionNames = bdd.list_collection_names()
    if "communes" not in collectionNames:
        insertLocationDataIntoMongDB(bdd["communes"])
    # Vérification que le nom n'existe pas
    checkNameDoesNotExist(bdd["people"],name)
    # Parcours de toutes les pages
    num_page = 1
    total = 0
    while num_page <= int(sys.argv[2])/50 : # Nombre de pages souhaitées
        url = getUrl(name,num_page)
        soup = makeRequest(url)
        if soup.find(text="Faire une nouvelle recherche") is not None:
            if num_page == 1 : # Il faut au moins 50 personnes
                return "not enough people"
            return coverage(bdd["people"],total,name)
        fiftyPersons = soup.findAll("a", class_="ligne-resultat")
        for person in fiftyPersons:
            total += 1 # On incrémente le nombre d'individus traités
            premium_access = person.find("span",class_="icon-token")
            if premium_access is None : # On elimine le contenu payant
                insertOnePersonIntoMongoDB(person["href"],bdd,name)
        num_page += 1
    return coverage(bdd["people"],total,name)

print(insertPeopleSameNameIntoMongoDB(sys.argv[1]))
sys.stdout.flush()


