package model

import (
	"github.com/jinzhu/gorm"
)

type Post struct {
	gorm.Model
	UserName string
	Author   *User
	Title    string
	Content  string
	ParentID uint
	Children []*Post `gorm:"foreignkey:ParentID"`
}
