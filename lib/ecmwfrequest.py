from ecmwfapi import ECMWFDataServer
from datetime import datetime
from os import getpid
import signal

class ApiServer():
    def __init__(self):
        self.server = ECMWFDataServer()

    def build_request(self, date_from, date_to, step, time, area = None):
        datef_in = "%Y-%m-%d"
        datef_out = "%Y-%m-%d"
        date = datetime.strptime(date_from, datef_in).strftime(datef_out) + "/to/" \
            + datetime.strptime(date_to, datef_in).strftime(datef_out)
        steps = ""
        for e in step:
            steps += str(e) + "/"
        steps = steps[0:-1]
        times = ""
        for e in time:
            times += str(e) + "/"
        times = times[0:-1]

        self.req = {
        	"class": "ti",
        	"dataset": "tigge",
        	"expver": "prod",
        	"grid": "0.5/0.5",
        	"levtype": "sfc",
        	"origin": "ecmf",
        	"param": "165/166",
        	"step": "0",
        	"type": "fc",
        	"target": "/home/tcarion/WebApp/public/grib_files/output.grib",
        }

        self.req["date"] = date
        self.req["step"] = steps
        self.req["time"] = times
        if area != None: self.req["area"] = area
        print(self.req)

    def send_request(self):
        signal.signal(signal.SIGALRM, handler)
        signal.alarm(10)
        self.server.retrieve(self.req)
        signal.alarm(0)

def handler(signum, frame):
        raise Exception("taking too long")