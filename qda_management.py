import os
import urllib2
import math
import pyspark_csv as pycsv

def tempSave(csv_location, table_name, sc, sqlContext):
    csv_location = downloadHTTP(csv_location)
    rdd = sc.textFile(csv_location)
    df = pycsv.csvToDataFrame(sqlContext, rdd)
    df.registerTempTable(table_name)

def permSave(csv_location, table_name, sc, sqlContext):
    csv_location = downloadHTTP(csv_location)
    rdd = sc.textFile(csv_location)
    df = pycsv.csvToDataFrame(sqlContext, rdd)
    df.write.saveAsTable(table_name)

# Credit to: https://gist.github.com/gourneau/1430932
## Returns path to temp file if its http or https
## Returns original path if not http or https
def downloadHTTP(url):
    if url.startswith("http") != True:
        return url

    baseFile = os.path.basename(url)

    os.umask(0002)
    temp_path = "/tmp/"
    try:
        file = os.path.join(temp_path,baseFile)

        req = urllib2.urlopen(url)
        total_size = int(req.info().getheader('Content-Length').strip())
        downloaded = 0
        CHUNK = 256 * 10240
        with open(file, 'wb') as fp:
            while True:
                chunk = req.read(CHUNK)
                downloaded += len(chunk)
                print math.floor( (downloaded / total_size) * 100 )
                if not chunk: break
                fp.write(chunk)
    except urllib2.HTTPError, e:
        print "HTTP Error:",e.code , url
        return False
    except urllib2.URLError, e:
        print "URL Error:",e.reason , url
        return False

    return file
