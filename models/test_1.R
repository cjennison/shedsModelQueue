# Computes min/max/mean value of each location id
# usage: RScript test_1.R <working directory> <inputs.json> <outputs.json>

# jsonlite is much better than rjson
# library(rjson)
library(jsonlite)
library(dplyr)

args <- commandArgs(TRUE)
# cmdargs <- fromJSON(args[1])
print(args)

# note: dir is already a function in R, better not to overwrite it, use wd instead
# also don't need fromJSON since the working directory is just a command line argument
# dir <- fromJSON(args[1])
# setwd(dir$wd)
wd <- args[1]
setwd(wd)

# get name of input file
input_file <- args[2]
if (!file.exists(input_file)) {
  # input file not found, throw error (stops script here)
  stop(paste0('Could not find input file: ', input_file))
}

# get name of output file
output_file <- args[3]

# print info
cat("------------------------------\n")
cat("Starting location stats script\n")
cat(paste0("Working Directory: ", wd, '\n'))
cat(paste0("Input File: ", input_file, '\n'))
cat(paste0("Output File: ", output_file, '\n'))
cat("------------------------------\n")

# parse inputs file
inputs <- fromJSON(input_file)

print(inputs)

# get list of location ids from inputs file
location_ids <- inputs$location_ids

# fetch temperature data from database
db <- src_postgres(dbname='conte_dev', host='127.0.0.1', port='5432', user='conte', password='conte')
# don't need the locations table, just using the location_id which is in the series table
# tbl_locations <- tbl(db, 'locations')
tbl_values <- tbl(db, 'values')
tbl_series <- tbl(db, 'series')

if (length(location_ids) == 0) {
  stop("Location IDs list is empty")
} else if (length(location_ids) == 1) {
  # use equals for only one location
  tbl_series <- filter(tbl_series, location_id == location_ids)
} else {
  # use IN for multiple locations
  tbl_series <- filter(tbl_series, location_id %in% location_ids)
}
data <- left_join(tbl_series, tbl_values, by=c('id'='series_id'))

# compute stats by location_id
location_stats <- group_by(data, location_id) %>%
  summarise(min=min(value), max=max(value), mean=mean(value))

# convert to data frame
location_stats <- as.data.frame(location_stats)

write(toJSON(location_stats, pretty=TRUE), file=output_file)

cat("------------------------------\n")
cat("Done\n")
cat("------------------------------\n")