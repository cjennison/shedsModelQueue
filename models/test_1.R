library(rjson)
library(dplyr)


#Receive input from user, this should contain 1) working directory, 2) Example or User Basin, 3) Basin Area (km^2)
args <- commandArgs(TRUE)

dir <- fromJSON(args[1])
print(dir)

#Set WD
setwd(dir$wd)


db <- src_postgres(dbname='conte_dev', host='127.0.0.1', port='5432', user='conte', password='conte')
tbl_locations <- tbl(db, 'locations')
tbl_values <- tbl(db, 'values')
tbl_series <- tbl(db, 'series')
