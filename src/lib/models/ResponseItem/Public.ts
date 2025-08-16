/**
 * Response List Bills Api Bill List Post
 *
 * BillPublic，公开账单信息
 */
export interface Response {
    /**
     * 创建人
     */
    created_by: UserPublic;
    /**
     * 创建时间
     */
    created_time: Date;
    id: string;
    /**
     * 更新时间
     */
    item_updated_time: Date;
    /**
     * 成员列表
     */
    members: BillMemberPublic[];
    /**
     * 标题
     */
    title: string;
    [property: string]: any;
}

/**
 * 创建人
 *
 * UserPublic，公开用户信息
 */
export interface UserPublic {
    id: string;
    /**
     * 用户名
     */
    username: string;
    [property: string]: any;
}

/**
 * BillMemberPublic，公开账单成员信息
 */
export interface BillMemberPublic {
    id: string;
    /**
     * 关联用户
     */
    linked_user?: null | UserPublic;
    /**
     * 成员名称
     */
    name: string;
    [property: string]: any;
}