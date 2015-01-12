library(rjson)


#Receive input from user, this should contain 1) working directory, 2) Example or User Basin, 3) Basin Area (km^2)
args <- commandArgs(TRUE)

dir <- fromJSON(args[1])
print(dir)

#Set WD
setwd(dir$wd)


val <- mean(rnorm(100000))

write(val, dir$output)
print(val)