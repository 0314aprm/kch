package main

import (
	"test.kch/api"
	"test.kch/db"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// DB
	db.Init()
	defer db.Close()

	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	/*
	 */
	jwtMw := middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey: []byte("secret"),
	})

	// Routes
	e.GET("/users/:id", api.GetUser)
	e.GET("/users", api.GetUsers)
	e.POST("/users", api.CreateUser)

	e.GET("/posts/:id/children", api.GetPostChildren)
	e.GET("/posts/:id", api.GetPost)
	e.GET("/posts", api.GetPosts)
	e.POST("/posts", api.CreatePost) //, jwtMw)

	e.POST("/login", api.Login)
	e.POST("/signup", api.Signup)
	e.POST("/me", api.Me, jwtMw)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))

	//
}
