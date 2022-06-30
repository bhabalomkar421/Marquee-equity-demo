from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import csv

class DataObject:
    def __init__(self):
        self.cin = ""
        self.name_company=""
        self.link=""
    def __str__(self):
        return("cin: " + str(self.cin) + "Company name: "+str(self.name_company)+" Link:" +str(self.link))
    def csvrow(self):
        return [str(self.cin),str(self.name_company),str(self.link)]
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None.
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns True if the response seems to be HTML, False otherwise.
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


def log_error(e):
    """
    It is always a good idea to log errors.
    This function just prints them, but you can
    make it do anything.
    """
    print(e)

# searchterm = input("Enter search term:")
# for()
count=0
data_array=[]

# getstr='https://www.zaubacorp.com/company-list/'
# print(getstr)
# html=simple_get(getstr)
# html = BeautifulSoup(html, 'html.parser')
# for tr in html.select('tr'):
#     for a in tr.select('a'):
#         tempObj = DataObject()
#         tempObj.cin=a['href'].split('/')[-1].split(',')[0]
#         tempObj.link=a['href']
#         tempObj.name_company = a.text
#         data_array.append(tempObj)
#     count+=1

for i in range(3001, 5001):
    getstr='https://www.zaubacorp.com/company-list/p-' + str(i) + '-company.html'
    print(getstr)
    html=simple_get(getstr)
    html = BeautifulSoup(html, 'html.parser')
    for tr in html.select('tr'):
        for a in tr.select('a'):
            tempObj = DataObject()
            tempObj.cin=a['href'].split('/')[-1].split(',')[0]
            tempObj.link=a['href']
            tempObj.name_company = a.text
            data_array.append(tempObj)
        count+=1

csvData=[]
for tempObj in data_array:
    csvData.append(tempObj.csvrow())

with open('data.csv', 'w') as csvFile:
    writer = csv.writer(csvFile)
    writer.writerows(csvData)
csvFile.close()