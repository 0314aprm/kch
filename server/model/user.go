package model

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name" form:"name" query:"name"`
	Username string `json:"username" form:"username" query:"username"`
	Password string `json:"password" form:"password" query:"password"`
}
