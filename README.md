# **Student API**

It is a simple CRUD REST API that deals with students

To use it, You have to install dependencies and have a .env file for the mongodb connection

To use these endpoints won't work unless you run npm start

All the following API are prefix with ``` /api/v1 ```

## **API Endpoints**
```
GET /students #Get all students

GET /student/<studentid> #Get a particular student

POST /student #Add a student

PUT /student/<studentid> #Change some details about a student.

DELETE /student/<studentid> #Delete the student profile
```