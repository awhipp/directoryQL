# DirectoryQL [WIP]

Flask Web Application using a SparkSQL backend which enables users to query flat files via SQL.

## Requirements

* Python 2.7
* Pip
* Oracle JRE and JDK 7+

## Getting Started

Pull required binaries via `pip install -r requirements.txt`

## Deployment

Execute `python server.py` to execute flask web application at `localhost:8080`

## Features

* Query your datasets using Native SparkSQL
* Connect to your data sources listed below
* Query multiple data sources as once without bringing them into the same environment

##### Table Management
![Table Management](https://i.imgur.com/hKA9ylM.png)

##### Raw Queries
![Raw Queries](https://i.imgur.com/Zudm5yv.png)

##### Aggregate Queries
![Aggregate Queries](https://i.imgur.com/AaXH0AA.png)

### File Support

* CSV

### Future File Support

* JSON
* Parquet
* TSV
* Excel
* zip and gzip

#### Confirmed DataSource Support

* Local FileSystem (such as `file:///Users/[USERNAME]/Downloads/Sacramentorealestatetransactions.csv`)
* HTTP (such as `http://samplecsvs.s3.amazonaws.com/Sacramentorealestatetransactions.csv`)
* HTTPS

#### Unconfirmed DataSource Support

* S3
* HDFS
