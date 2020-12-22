#!/opt/anaconda3/bin/python
from ecmwfapi import ECMWFDataServer
import ast
from datetime import datetime
import os

req_file = os.path.join(os.getcwd(), 'public', 'grib_files', 'request.txt')
with open(req_file, 'r') as myfile:
    content = myfile.read()


# req = json.loads(content)
args = ast.literal_eval(content) 
date = args["date_request"]
time = args["times_request"]
area = args['area'] if 'area' in args else None

datef_in = "%Y-%m-%d"
datef_out = "%Y-%m-%d"
date = datetime.strptime(date, datef_in).strftime(datef_out)
times = ""
for e in time:
    times += str(e) + "/"
times = times[0:-1]
req = {
	"class": "ti",
	"dataset": "tigge",
	"expver": "prod",
	"grid": "0.5/0.5",
	"levtype": "sfc",
	"origin": "ecmf",
	"param": "165/166",
	#"step": "0/6/12/18/24/30/36/42/48/54/60/66/72/78/84/90/96/102/108/114/120/126/132/138/144/150/156/162/168/174/180/186/192/198/204/210/216/222/228/234/240/246/252/258/264/270/276/282/288/294/300/306/312/318/324/330/336/342/348/354/360",
	"step": "0/6/12/18/24",
	"type": "fc",
	"target": "/home/tcarion/CBRN-dispersion-app/public/grib_files/output_" + datetime.now().strftime('%y%m%d%H%M%S') + ".grib",
}
req["date"] = date
req["time"] = times
if area != None: req["area"] = area

server = ECMWFDataServer()

server.retrieve(req)
