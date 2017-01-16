import sys
import time
import datetime  
import os

f_handler=open('log.txt', 'a') 
sys.stdout=f_handler 
now = time.strftime("%H:%M:%S")
today = datetime.date.today()  
print("%s--%s,Success" % (today,now))

print(os.path.dirname(os.path.abspath(__file__)))
