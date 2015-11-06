# HW3
The are three files in this HW3 repository:
* main.js which is server instance running on port 3000
* main1.js which is server instance running on port 3001
* proxy.js which is the proxy server running on port 80

# Prerequisites
* For implementing the proxy server, the node-http-proxy library is used. To install this dependency, you need to run the following in the repository: 
```
cd Queues
npm install http-proxy --save
```
* You also need to start the redis server by running the following:
```
redis-server
```
* To run the first server instance running on port 3000, run the following: 
```
node main.js
```
* To run the second server instance running on port 3001, run the following:
```
node main1.js
```
* To run the proxy server running on port 80, run the following: 
```
sudo node proxy.js
```
You need to enter the password

# Complete set/get
To check whether this works, you need to type the following in the browser:
```
localhost:3000/set
localhost:3000/get
```

# Complete recent
To check whether this works, you need to type the following in the browser:
```
localhost:3000/recent
```

# Complete upload/meow
In order to perform the upload, run the following command on the command line: 
```
curl -F "image=@./image1.jpg" localhost:3000/upload
```
In order to view the image in the browser, type the following in the browser:
```
localhost:3000/meow
```

# Additional service instance running
The second file main1.js represents the second server instance running on port 3001. It can be run as mentioned previously. All the commands for the first server instance are also applicable to it.

# Demonstrate proxy

The proxy server has been implemented as follows: 
It makes use of a global flag variable which has been set to zero initially. It uses two queues for load balancing. They are named as 'queue' and 'inprocess'. When the proxy server is first run it first checks the flag. If the flag value is zero, means the proxy server is being run for the first time, so it trims the existing 'queue' and completely empties it. It then inserts two urls into the queue:
```
http://localhost:3001 (head)
http://localhost:3000 (tail)
```
It sets
```
flag=1
```

Status of queues:
```
'queue' has 2 entries
'inprocess' is empty
```

The proxy server then uses rpoplpush to pop the value at the tail of the queue 
```
queue
```
The value is 
```
http://localhost:3000
```
It inserts that value at the head of the second queue which is named:
```
inprocess
```
It then redirects the request to that server instance. The following is just a code snippet. You need to look at the actual proxy.js file in order to understand it.
```
proxy.web(req, res, {target: data}); 
```
Here data is the popped value

It then again does a rpoplpush and puts the value back into the first queue
```
queue
```
```
http://localhost:3000 (head)
http://localhost:3001 (tail)
```
So next call to proxy server, will result in call to 
```
http://localhost:3001 
```





