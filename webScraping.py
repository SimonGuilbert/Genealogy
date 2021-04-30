# -*- coding: utf-8 -*-
"""
Created on Mon Apr 26 14:29:24 2021

@author: simon
"""

from urllib.request import Request
from urllib.request import urlopen
from bs4 import BeautifulSoup
import pymongo

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

# =============================================================================
# Traitement particulier pour chaque type de document
# =============================================================================
def relevesCollaboratifs(soup):
    res = {}
    # Evenement (mariage ou deces)
    title = soup.title.string.split(" ")
    event = "Mariage"
    for element in title :
        if element == "Décès" :
            event = element
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
            res["code_commune"] = int(stripped)
            
    if year == -1 : return "not enough data" 
    res["prenom"] = "inconnu"
    res[event] = year
    return res


def arbreGenealogique(soup):
    res = {}
    # Prénom
    title = soup.title.string.split(" ")
    res["prenom"] = title[0]
    return res
    
    

# =============================================================================
# Insertion d'un individu dans MongoDB
# =============================================================================
def insertOnePersonIntoMongoDB(url,collection):
    short_url = url[25:43]
    very_short_url = url[25:35]
    head_url = url[:23]
    data = {} # Initialisation donnees a inserer
    if short_url == "releves-collaborat" :
        data = relevesCollaboratifs(makeRequest(url))
    elif head_url == "https://gw.geneanet.org":
        data = arbreGenealogique(makeRequest(url))
    elif very_short_url == "cimetieres" :
        pass
    else:
        print("Unsupported URL")
#        print(url)

    if data:
        pass
    #   collection.insert_one(data)
    

# =============================================================================
# Recherche de tous les individus du meme nom
# =============================================================================
def insertPeopleSameNameIntoMongoDB(name):
    # Connexion à MongoDB
    serveur = pymongo.MongoClient("mongodb://localhost:27017/")
    bdd = serveur["genealogy"]
    collection = bdd["people"]
    # Parcourt de toutes les pages
    num_page = 1
    while num_page <= 50 : # On limite à 50 pages
        url = getUrl(name,num_page)
        soup = makeRequest(url)
        if soup.find(text="Faire une nouvelle recherche") is not None:
            if num_page == 1 : # Il faut au moins 50 personnes
                return "not enough people"
            return "success"
        fiftyPersons = soup.findAll("a", class_="ligne-resultat")
        for person in fiftyPersons:
            premium_access = person.find("span",class_="icon-token")
            if premium_access is None : # On elimine le contenu payant
                insertOnePersonIntoMongoDB(person["href"],collection)
        num_page += 1
    return "success"
        
print(insertPeopleSameNameIntoMongoDB("dupont"))

