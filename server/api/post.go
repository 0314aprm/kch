package api

import (
	"fmt"
	"net/http"
	"strconv"

	"test.kch/db"
	"test.kch/model"

	"github.com/labstack/echo/v4"
)

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

type ResPost struct {
	ID       uint
	Title    string
	Content  string
	Children []*ResPost
}

func toResPost(c *model.Post) *ResPost {
	return &ResPost{
		ID:      c.ID,
		Title:   c.Title,
		Content: c.Content,
	}
}

func getQuery(c echo.Context, qs string, minValue int, maxValue int, defaultValue int) int {
	param := c.QueryParam(qs)
	if param == "" {
		return defaultValue
	}
	i, _ := strconv.Atoi(param)
	return max(min(i, maxValue), minValue)
}

func DeletePost(c echo.Context) (err error) {
	db := db.DbManager()
	post := model.Post{}
	err = db.First(&post, c.Param("id")).Error
	if err != nil {
		return
	}

	db.Delete(&post)
	return
	//return c.JSON(http.StatusOK, post)
}

func GetPosts(c echo.Context) (err error) {
	page := getQuery(c, "p", 1, 100, 1)
	perPage := getQuery(c, "n", 0, 20, 10)

	db := db.DbManager()
	posts := []model.Post{}
	err = db.Offset((page - 1) * perPage).Limit(perPage).Find(&posts).Error

	return c.JSON(http.StatusOK, posts)
}
func GetPost(c echo.Context) error {
	db := db.DbManager()
	post := model.Post{}
	db.First(&post, c.Param("id"))

	return c.JSON(http.StatusOK, post)
}
func GetPostChildren(c echo.Context) (err error) {
	// 親取得
	parentId := c.Param("id")
	parent := new(model.Post)
	db := db.DbManager()
	err = db.First(parent, parentId).Error
	if err != nil {
		return
	}

	//
	page := getQuery(c, "p", 1, 100, 1)
	perPage := getQuery(c, "n", 0, 20, 10)
	maxLevel := getQuery(c, "l", 2, 4, 2)

	var getChildren func(pid uint, post *ResPost, level int)
	getChildren = func(pid uint, post *ResPost, level int) {
		if level > maxLevel || level > 10 {
			return
		}
		children := []model.Post{}
		fmt.Println(page, perPage, perPage, maxLevel)
		err := db.Where("parent_id = ?", pid).Offset((page - 1) * perPage).Limit(perPage).Find(&children).Error
		if err != nil || len(children) == 0 {
			return
		}
		fmt.Println("pid:", pid, ", len:", len(children))
		post.Children = make([]*ResPost, len(children))
		for i, c := range children {
			post.Children[i] = toResPost(&c)
			getChildren(c.ID, post.Children[i], level+1)
		}
	}
	resChildren := ResPost{}
	getChildren(parent.ID, &resChildren, 0)
	fmt.Println(resChildren.Children)

	return c.JSON(http.StatusOK, resChildren.Children)
}
func CreatePost(c echo.Context) (err error) {
	type ReqPost struct {
		UserName string `json: username`
		Title    string `json:"title"`
		Content  string `json:"content"`
		ParentID int    `json:"parent"`
	}
	req := new(ReqPost)
	if err = c.Bind(req); err != nil {
		return
	}

	db := db.DbManager()
	parent := new(model.Post)
	err = db.First(parent, req.ParentID).Error
	if err != nil {
		fmt.Println("post not found", req.ParentID)
		//return
	}

	fmt.Println("parent", parent.ParentID)
	post := model.Post{
		UserName: req.UserName,
		Author:   nil,
		Title:    req.Title,
		Content:  req.Content,
		ParentID: parent.ID,
		Children: []*model.Post{},
	}
	db.Create(&post)
	db.Model(parent).Association("Children").Append(post)

	return c.JSON(http.StatusOK, toResPost(&post))
}
