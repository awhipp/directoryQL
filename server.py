import os
import sys

#SPARK_HOME = 'spark-2.1.0'

# Add the PySpark/py4j to the Python Path
#sys.path.insert(0, os.path.join(SPARK_HOME, "python", "lib"))
#sys.path.insert(0, os.path.join(SPARK_HOME, "python"))

from pyspark import SparkContext
from pyspark.sql import SQLContext

import flask
import qda_management as manage
import pandas
import urllib

from flask import Flask, request, send_from_directory

sc = SparkContext("local[*]", "Data Generation Web Application")
sqlContext = SQLContext(sc)
data_dir = None
data_name = None

sc.addPyFile('pyspark_csv.py')

# Setup Flask app.
app = Flask(__name__)

# Routes
@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/tables', methods = ['GET'])
def get_existing_tables():
    return sqlContext.sql('show tables').toPandas().to_json(orient='records')


@app.route('/location', methods = ['POST'])
def set_location():
    global data_dir
    data_dir = urllib.unquote(request.data)
    print("Location set to: " + data_dir)
    return "true"

@app.route('/table', methods = ['POST'])
def set_table():
    global data_name
    data_name = urllib.unquote(request.data)
    print("Table name set to: " + data_name)
    return "true"

@app.route('/saveData', methods = ['POST'])
def set_data():
    manage.tempSave(data_dir, data_name, sc, sqlContext)
    return "true"

@app.route('/sql', methods = ['POST'])
def execute_sql():
    print(data_dir)
    if data_dir != None:
        if data_name != None:
            sql = urllib.unquote(request.data)
            if sql.endswith((';')):
                sql = sql[0:-1]
            print("New Query: " + sql)
            return sqlContext.sql(sql).limit(1000).toPandas().to_json(orient='records')
    return "false"


if __name__ == '__main__':
  app.run(host="0.0.0.0", port=int("8080"), debug=True)
