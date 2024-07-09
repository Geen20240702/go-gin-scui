package dto

import "go-gin/model"

// 返回给前端的当前用户信息
type UserInfoDto struct {
	ID           uint          `json:"id"`
	Username     string        `json:"username"`
	Mobile       string        `json:"mobile"`
	Avatar       string        `json:"avatar"`
	Nickname     string        `json:"nickname"`
	Introduction string        `json:"introduction"`
	Roles        []*model.Role `json:"roles"`
}

func ToUserInfoDto(user model.User) UserInfoDto {
	return UserInfoDto{
		ID:           user.ID,
		Username:     user.Username,
		Mobile:       user.Mobile,
		Avatar:       user.Avatar,
		Nickname:     *user.Nickname,
		Introduction: *user.Introduction,
		Roles:        user.Roles,
	}
}

// 返回给前端的用户列表
type UsersDto struct {
	ID           uint   `json:"ID"`
	Username     string `json:"username"`
	Mobile       string `json:"mobile"`
	Avatar       string `json:"avatar"`
	Nickname     string `json:"nickname"`
	Introduction string `json:"introduction"`
	Status       uint   `json:"status"`
	Creator      string `json:"creator"`
	CreatedAt    string `json:"created_at"`
	RoleIds      []uint `json:"roleIds"`
	RoleNames      []string `json:"roleNames"`
}

func ToUsersDto(userList []*model.User) []UsersDto {
	var users []UsersDto
	for _, user := range userList {
		userDto := UsersDto{
			ID:           user.ID,
			Username:     user.Username,
			Mobile:       user.Mobile,
			Avatar:       user.Avatar,
			Nickname:     *user.Nickname,
			Introduction: *user.Introduction,
			Status:       user.Status,
			Creator:      user.Creator,
			CreatedAt:    user.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		roleIds := make([]uint, 0)
		roleNames := make([]string, 0)
		for _, role := range user.Roles {
			roleIds = append(roleIds, role.ID)
			roleNames = append(roleNames, role.Name)
		}
		userDto.RoleIds = roleIds
		userDto.RoleNames = roleNames
		users = append(users, userDto)
	}

	return users
}
