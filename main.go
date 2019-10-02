package main

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Product struct {
	Code string
	Price uint
}

type User struct {
	gorm.Model
	username string "gorm:not null"
	title string "gorm:not null"
	content string "gorm:not null"
	Parent_id string
}

func main() {
  db, err := gorm.Open("sqlite3", "test.db")
  if err != nil {
    panic("データベースへの接続に失敗しました")
  }
  defer db.Close()

  // スキーマのマイグレーション
  db.AutoMigrate(&Product{})

  // Create
  db.Create(&User{id: 1, username: "kinoshita", title: "firsttitle", content: "hello", Parent_id:"qwer"})

  // Read
  var user User
  db.First(&product, 1) // idが1の製品を探します
  db.First(&product, "code = ?", "L1212") // codeがL1212の製品を探します

  // Update - 製品価格を2,000に更新します
  db.Model(&product).Update("Price", 2000)

  // Delete - 製品を削除します
  db.Delete(&product)
}