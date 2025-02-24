## LOOBAA
Loobaa is a Load Balancer written in Express.

### Features
- Round Robin Algorithm.
- Periodic health check of servers.
- Allows health check period to be specified on the command line.

### To run locally
#### to start the backend servers.
Bash
```
// to start the backend servers.
npm run start:servers
```
**NOTE** \
Currently 3 servers will be up. \
To tweak the number of active servers, go to
https://github.com/malabar-dizziness/loobaa/blob/bbee87e17fdba9c0d246275df5725a8fdd58709c/src/server.ts#L9-L11 
and adjust here.


#### to start the load balancer
Bash
```
// to start the load balancer
npm run start:balancer
```

**Note** \
If the number of servers are changed, make sure to add the server baseUrls here:
https://github.com/malabar-dizziness/loobaa/blob/f39236b1a5b1a18fa3676e76770d7db34a5933ce/src/balancer.ts#L17-L20

### To test the loobaa's efficiency
bash
```
curl --parallel --parallel-immediate --parallel-max 3 --config urls.txt
```
Tweak the maximum parallelisation to see how well the server copes!
