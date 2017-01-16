import requests
import time
import json
import hashlib
import pymysql
import sys
import datetime  
import os

d_path = os.path.dirname(os.path.abspath(__file__))

database_ip_and_port = '127.0.0.1'
database_name = 'smzdm'
database_username = 'root'
database_password = '123456'

keys_file_path = d_path + '/key_packs'

def get_real_time_data():
	c_time = int(time.time())
	headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Host': 'www.smzdm.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
	}

	url = 'http://www.smzdm.com/json_more?timesort=' + str(c_time)
	r = requests.get(url=url, headers=headers)

	# data = r.text.encode('utf-8').decode('unicode_escape')
	data = r.text
	dataa = json.loads(data)
	print(dataa)

	resultList = []

	for string in dataa:
		title = string['article_title']
		price = ''
		if 'article_price' in string.keys():
			price = string['article_price']
		link = ''
		if 'article_link' in string.keys():
			link = string['article_link']
		page_url = string['article_url']
		result = {
			'title': title,
			'price': price,
			'link': link,
			'page_url': page_url
		}
		resultList.append(result)

	return resultList

def read_local_file_keys():
	with open(keys_file_path,'rt',encoding='utf-8') as f:
		file_data = f.read()
		file_data = file_data.strip("\r\n")
		return file_data.split(sep=',')

def md5(str):
    print(str)
    m = hashlib.md5()
    m.update(str.encode(encoding='utf-8'))
    return m.hexdigest()


def is_data_existed(result):
	db = pymysql.connect(database_ip_and_port, database_username, database_password, database_name)
	cursor = db.cursor()
	tempResult = sorted(result.items(), key=lambda result: result[0])
	sql = "SELECT * FROM smzdm_record where md5 = '%s'" % md5(str(tempResult))

	print(md5(str(tempResult)))
	try:
		cursor.execute(sql) 
		print(cursor.rowcount)
		if cursor.rowcount > 0 :
			return False
		else:
			return True
	except:
		cursor.rollback()
	finally:
		cursor.close()		
		db.close()

def insert_data(result):
	db = pymysql.connect(database_ip_and_port, database_username, database_password, database_name)
	db.set_charset('utf8')
	cursor = db.cursor()
	tempResult = sorted(result.items(), key=lambda result: result[0])
	sql = "INSERT INTO smzdm_record(title,price,link,page_url,md5) VALUES ('%s','%s','%s','%s','%s')" % \
	(result['title'],result['price'],result['link'],result['page_url'],md5(str(tempResult)))

	try:
		cursor.execute(sql)
		db.commit()
		if cursor.rowcount > 0:
			return True
		else:
			return False
	except Exception as e:
		print(e)
		db.rollback()

	db.close()


if __name__ == '__main__':
	keys = read_local_file_keys()
	resultList = get_real_time_data()
	#print(resultList)
	log_path = d_path + '/log.txt'
	f_handler=open(log_path, 'a') 
	 
	for result in resultList:
		for key in keys:
			if result['title'].find(key) != -1:
				if is_data_existed(result):
					 insert_data(result)
	sys.stdout=f_handler 
	now = time.strftime("%H:%M:%S")
	today = datetime.date.today() 
	print("%s--%s,Success" % (today,now))
    


