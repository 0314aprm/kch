package db

import (
	"test.kch/model"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

func Init() {
	db, err = gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("DB Connection Error")
	}
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Post{})
}
func Close() {
	db.Close()
}

func DbManager() *gorm.DB {
	return db
}
