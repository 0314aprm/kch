

テスト
```
curl -X POST http://localhost:1323/users -H 'Content-Type: application/json' -d '{""name"":""Joe"", ""username"":""joe"", ""password"": ""password""}'
curl -X POST http://localhost:1323/posts -H 'Content-Type: application/json' -d '{""user_name"":""hoge"", ""title"":""titlll"", ""content"": ""contonto"", ""parent"": 1}'

curl -X GET "http://localhost:1323/users"
curl -X GET "http://localhost:1323/users/1"
curl -X GET "http://localhost:1323/posts"
curl -X GET "http://localhost:1323/posts/1"
curl -X GET "http://localhost:1323/posts/1/children"
```
