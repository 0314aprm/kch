package api

import (
	"net/http"

	"test.kch/db"
	"test.kch/model"

	"github.com/labstack/echo/v4"
)

func DeleteUser(c echo.Context) (err error) {
	db := db.DbManager()
	user := model.User{}
	err = db.First(&user, c.Param("id")).Error
	if err != nil {
		return
	}

	db.Delete(&user)
	return
	//return c.JSON(http.StatusOK, post)
}
func GetUsers(c echo.Context) (err error) {
	page := getQuery(c, "p", 1, 100, 1)
	perPage := getQuery(c, "n", 0, 20, 10)

	db := db.DbManager()
	users := []model.User{}
	err = db.Offset((page - 1) * perPage).Limit(perPage).Find(&users).Error

	return c.JSON(http.StatusOK, users)
}
func GetUser(c echo.Context) error {
	db := db.DbManager()
	user := model.User{}
	db.First(&user, c.Param("id"))

	return c.JSON(http.StatusOK, user)
}
func CreateUser(c echo.Context) (err error) {
	u := new(model.User)
	if err = c.Bind(u); err != nil {
		return
	}
	db := db.DbManager()
	db.Create(&u)
	return c.JSON(http.StatusOK, u)
}
