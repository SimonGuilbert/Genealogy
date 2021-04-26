from urllib.request import Request
from urllib.request import urlopen
from bs4 import BeautifulSoup

url = "https://www.geneanet.org/fonds/individus/?go=1&nom=Guilbert&prenom=&prenom_operateur=or&with_variantes_nom=&with_variantes_nom_conjoint=&with_variantes_prenom=&with_variantes_prenom_conjoint=&size=10"

req = Request(url, headers={
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"})
html = urlopen(req).read()
html_soup = BeautifulSoup(html, 'html.parser')

persons = html_soup.findAll("a", class_="ligne-resultat")
print(len(persons))
