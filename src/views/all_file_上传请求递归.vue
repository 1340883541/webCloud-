<template>
    <div class="container all_file_container">
        <div class="all_file_h clearfix">
            <el-col :span="16">
                <div class="file_h_left" v-if="!isShowPath">
                    <div class="file_h_item" v-if="isRbac_upload">
                        <el-dropdown placement="bottom-start" trigger="click">
                            <el-button type="primary" size="small">
                                <img src="../assets/icon_up.png">上传
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="handleUploadWj">上传文件</el-dropdown-item>
                                <el-dropdown-item @click.native="handleUploadWjjia">上传文件夹</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="file_h_item" v-if="isRbac_create">
                        <el-button class="color-green" size="small" @click="handleWjjOpenHead">
                            <img src="../assets/icon_wjj.png">
                            创建文件夹
                        </el-button>
                    </div>
                    <div class="file_h_item">
                        <el-button class="color-green" size="small" @click="handledownloadWjHead">
                            <img src="../assets/icon_plxz.png">批量下载
                        </el-button>
                    </div>
                    <div class="file_h_item" v-if="isRbac_remove && isAuth">
                        <el-button class="color-green" size="small" @click="handleRomoveWjHead">
                            <img src="../assets/icon_ydd.png">移动到
                        </el-button>
                    </div>
                    <div class="file_h_item" v-if="isRbac_fileRoot && isAuth">
                        <el-button class="color-green" size="small" @click="handleRootWjHead">
                            <img src="../assets/icon_set_root.png">设置文件权限
                        </el-button>
                    </div>
                    <div class="file_h_item" v-if="isRbac_del && isAuth">
                        <el-button class="color-green" size="small" @click="handleDeleteWjHead">
                            <img src="../assets/icon_plsc.png">批量删除
                        </el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" class="fr">
                <div class="file_h_right">
                    <el-input placeholder="请输入搜索文件名" class="input-with-select input-search" size="small" 
                        v-model.trim="keywords" @keyup.enter.native="spikSearchkey">
                        <el-button slot="append" @click="spikSearchkey"><img style="vertical-align: middle;" src="../assets/icon_search.png"></el-button>
                    </el-input>
                    <template v-if="!isShowPath">
                        <el-dropdown trigger="click" @command="handleSortCommand">
                            <div class="file_h_r_icon">
                                <img v-show="sort_type=='asc'" src="../assets/icon_px_jx.png">
                                <img v-show="sort_type=='desc'" src="../assets/icon_px_sx.png">
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item class="dropdown_head" :class="{'dropdown_active_icon':order_by=='file_name'}" command="file_name">
                                    文件名
                                </el-dropdown-item>
                                <el-dropdown-item class="dropdown_head" :class="{'dropdown_active_icon':order_by=='size'}" command="size">
                                    文件大小
                                </el-dropdown-item>
                                <el-dropdown-item class="dropdown_head" :class="{'dropdown_active_icon':order_by=='last_modified_date'}" command="last_modified_date">
                                    更新时间
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div class="file_h_r_icon" v-if="!isShowtable" @click="spikChangeTable"><img src="../assets/icon_list.png"></div>
                        <div class="file_h_r_icon" v-if="isShowtable" @click="spikChangeTable"><img src="../assets/iocn_sy.png"></div>
                    </template>
                </div>
            </el-col>
            <el-col :span="24">
                 <div class="file-h-p0">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item @click.native="handleAllFilebreadb" style="cursor:pointer;">全部文件</el-breadcrumb-item>
                        <el-breadcrumb-item style="cursor:pointer;"
                             v-if="breadcrumbtitList" v-for="(item,index) in breadcrumbtitList"
                            :key="index"
                            @click.native="handleItemFilebreadb(item.fileTarId,index)">
                            {{item.fileName}}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="file-h-p1">已加载{{tableData.length}}个，共{{totalCount}}个文件</div>
            </el-col>
        </div>
        <!-- 内容区 -->
        <div class="file_body clearfix" :class="{'search_file_body':isShowPath}">
            <!-- 表格列表 -->
            <el-col v-if="isShowtable" :span="24" v-loading="isloadlist" :element-loading-text="loadlistTxt" element-loading-background="rgba(255, 255, 255, 0.7)">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :select-on-indeterminate="true"
                    :header-cell-style="{background:'#fff',fontSize:'14px',color:'#666',fontWeight:'400',padding:' 8px 0'}"
                    @selection-change="handleCheckChange"
                    @sort-change="changeTableSort"
                    :default-sort = "defaultSort"
                    >
                    <!-- @click.native="cellClickFile" @row-dblclick="dblclickFileRow"-->
                    <el-table-column type="selection" width="55" label="全选"></el-table-column>
                    <el-table-column prop="fileName" label="文件名"  min-width="200" :sortable="'custom'">
                        <template slot-scope="scope">
                            <div class="flex-wrap flex-con filename_td" >
                                <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                                <img class="filename_icon fl" v-if="scope.row.type == 0" src="../assets/type/wjj_small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <!-- 文档 -->
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.doc'||scope.row.suffix=='.docx'||scope.row.suffix=='.docm'||
                                    scope.row.suffix=='.dotm'||scope.row.suffix=='.dotx'||scope.row.suffix=='.wps'||scope.row.suffix=='.doc'||
                                    scope.row.suffix=='.rtf'" src="../assets/type/doc-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.ppt'||scope.row.suffix=='.pptx'||scope.row.suffix=='.pptm'||
                                    scope.row.suffix=='.ppsx'||scope.row.suffix=='.ppsm'||scope.row.suffix=='.potx'||scope.row.suffix=='.potm'||
                                    scope.row.suffix=='.ppam'" src="../assets/type/ppt-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.pdf'" src="../assets/type/PDF-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.txt'" src="../assets/type/txt-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.rar'||scope.row.suffix=='.gz'||scope.row.suffix=='.arj'||
                                    scope.row.suffix=='.zip'" src="../assets/type/rar-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <img class="filename_icon fl" v-if="scope.row.suffix=='.csv'||scope.row.suffix=='.xls'||scope.row.suffix=='.xlsx'||scope.row.suffix=='.xlsm'||scope.row.suffix=='.xltx'||
                                    scope.row.suffix=='.xltm'||scope.row.suffix=='.xlsb'||scope.row.suffix=='.xlam'" src="../assets/type/xls-small.png" 
                                    style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                <!-- 图片 -->
                                <img class="filename_icon fl" style="cursor: pointer" v-if="scope.row.type == 2" @click="dblclickFileRow(scope.row)" src="../assets/type/JPG-small.png">
                                <!-- 音乐视频 -->
                                <img class="filename_icon fl" v-if="scope.row.type == 3 || scope.row.type == 4" src="../assets/type/MP3-small.png">
                                <!-- 其它 -->
                                <img class="filename_icon fl" v-if="scope.row.type == 5" src="../assets/type/other-small.png">

                                <span class="table_filename elipseone" :title="scope.row.fileName" style="" @click="dblclickFileRow(scope.row)">{{ scope.row.fileName }}</span>
                                <img v-if="isRbac_fileRoot && scope.row.authority == 1 && scope.row.soleSet == 1" style="cursor:pointer;" class="table_fileroot display" src="../assets/icon_wjroot.png" @click.stop="handleSetRootwj(scope.row,1)">
                                <!-- 是否收藏操作 -->
                                <img v-if="isRbac_collect && scope.row.collected == 0" style="cursor:pointer;" class="table_fileroot" src="../assets/icon_sc_no.png" @click.stop="handleSetCollectwj(scope.row)">
                                <img v-if="isRbac_collect && scope.row.collected == 1" style="cursor:pointer;" class="table_fileroot display" src="../assets/icon_sc_hs.png" @click.stop="handleSetCollectwj(scope.row)">
                            </div>
                           <div class="flex-wrap elipseone wj_path_div" v-if="isShowPath" @click.stop="handleLinkPath(scope.row)"><span>位置 : {{scope.row.visitUrl}}</span></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sizeFormat" :formatter="sizeFormatFormatter" label="文件大小" width="120" :sortable="'custom'"></el-table-column>
                    <el-table-column prop="lastModifiedDate" label="更新时间" width="200" :sortable="'custom'"></el-table-column>
                    <el-table-column prop="modifier" :formatter="modifierFormatter" label="更新人" width="150"></el-table-column>
                    <el-table-column prop="description" :formatter="descriptionFormatter" label="备注" min-width="120"></el-table-column>
                    <el-table-column label="操作" width="150" v-if="!isShowPath">
                        <template slot-scope="scope">
                            <div class="table_cz_icon" @click="handledownloadWj(scope.row)"><img src="../assets/icon_xz.png"></div>
                            <div v-if="isRbac_share" class="table_cz_icon" @click="handleShareWj(scope.row)"><img src="../assets/icon_fxl.png"></div>
                            <el-dropdown class="file_body_table_dropdown" trigger="click">
                                <div class="table_cz_icon"><img src="../assets/icon_more_lv.png"></div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="isRbac_share" @click.native="handleShareWj(scope.row)">分享</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_fileRoot  && scope.row.authority == 1" @click.native="handleSetRootwj(scope.row,0)">设置权限</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_rename  && scope.row.authority == 1" @click.native="handleRenameWj(scope.row)">重命名</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_remove  && scope.row.authority == 1" @click.native="handleRomoveWj(scope.row)">移动到</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_copy  && scope.row.authority == 1" @click.native="handleCopyWj(scope.row)">复制到</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_del && scope.row.authority == 1" @click.native="handleDeleteWj(scope.row.fileTarId)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-row slot="append" style="text-align:center; line-height:46px;" v-if="total_page > 1">
                        <a href="javascript:;" class="blue01" style="font-size:12px;" @click.stop="appendTable" :loading="table_loading">{{page_txt}}</a>
                    </el-row>
                </el-table>
            </el-col>
            <!-- 缩略图 -->
            <el-col v-if="!isShowtable" :span="24" style="margin-top:10px;">
                <div class="all_checkbox">
                    <el-checkbox v-model="thumb_checkAll" @change="handlethumbCheckAll">全选</el-checkbox>
                </div>
                <div class="thumbnail_list clearfix">
                    <div class="thumbnail_item"
                        v-for="(item,index) in tableData" :key="index"
                        :class="{'thumbnail_item_active':item.isChecked || currthumbindex==index}" 
                        @mouseenter="spikEnterlist(index)"
                        @click.stop="dblclickFileRow(item)">
                        <!-- @mouseenter="spikEnterlist(index)" 
                        @mouseleave="spikLeavelist" -->
                        <div class="thumbnail_item_top clearfix" v-show="currthumbindex==index || item.isChecked">
                            <img class="radio_img fl" src="../assets/icon_check_radiao.png" :class="{'opcity':item.isChecked}" @click.stop="spikthumbRadio(item,index)">
                            <el-dropdown class="file_body_table_dropdown radio_more fr" trigger="click" placement="right-start">
                                <div class="" @click.stop="spikthumbDropdown(index)"><img class="" src="../assets/icon_more_hs.png"></div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="isRbac_share" @click.native="handledownloadWj(item)">下载</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_share" @click.native="handleShareWj(item)">分享</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_fileRoot && item.authority == 1" @click.native="handleSetRootwj(item,0)">设置权限</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_rename && item.authority == 1" @click.native="handleRenameWj(item)">重命名</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_remove && item.authority == 1" @click.native="handleRomoveWj(item)">移动到</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_copy && item.authority == 1" @click.native="handleCopyWj(item)">复制到</el-dropdown-item>
                                    <el-dropdown-item v-if="isRbac_del && item.authority == 1" @click.native="handleDeleteWj(item.fileTarId)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div class="thumbnail_item_info flex-wrap flex-hh flex-center flex-align-item-flex-end">
                            <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                            <!-- 文件夹 -->
                            <img v-if="item.type == 0" src="../assets/type/wjj.png" class="thumbnail_item_img" >
                            <!-- 文档 -->
                            <img v-if="item.suffix=='.doc'||item.suffix=='.docx'||item.suffix=='.docm'||
                                item.suffix=='.dotm'||item.suffix=='.dotx'||item.suffix=='.wps'||item.suffix=='.doc'||
                                item.suffix=='.rtf'" src="../assets/type/doc.png" class="thumbnail_item_img">
                            <img v-if="item.suffix=='.ppt'||item.suffix=='.pptx'||item.suffix=='.pptm'||
                                item.suffix=='.ppsx'||item.suffix=='.ppsm'||item.suffix=='.potx'||item.suffix=='.potm'||
                                item.suffix=='.ppam'" src="../assets/type/ppt.png" class="thumbnail_item_img">
                            <img v-if="item.suffix=='.pdf'" src="../assets/type/pdf.png" class="thumbnail_item_img">
                            <img v-if="item.suffix=='.txt'" src="../assets/type/txt.png" class="thumbnail_item_img">
                            <img v-if="item.suffix=='.rar'||item.suffix=='.gz'||item.suffix=='.arj'||
                                item.suffix=='.zip'" src="../assets/type/rar.png" class="thumbnail_item_img">
                            <img  v-if="item.suffix=='.csv'||item.suffix=='.xls'||item.suffix=='.xlsx'||item.suffix=='.xlsm'||item.suffix=='.xltx'||
                                item.suffix=='.xltm'||item.suffix=='.xlsb'||item.suffix=='.xlam'" src="../assets/type/xls.png" class="thumbnail_item_img">
                            <!-- 图片 -->
                            <img v-if="item.type == 2" src="../assets/type/JPG.png" class="thumbnail_item_img">
                            <!-- 音乐视频 -->
                           <img v-if="item.type == 3 || item.type == 4" src="../assets/type/MP3.png" class="thumbnail_item_img" >
                           <!-- 其它 -->
                           <img v-if="item.type == 5" src="../assets/type/other.png" class="thumbnail_item_img">

                            <div class="thumbnail_item_text w-elli">{{item.fileName}} </div>
                        </div>
                        <!-- 更多操作下拉 -->
                        <!-- <div class="more_dropdown" v-show="currtdropdown == 1">
                            <li class="m_d_item">下载</li>
                            <li class="m_d_item">分享</li>
                            <li class="m_d_item">协作权限</li>
                        </div> -->
                    </div>
                </div>
                <div v-if="tableData.length<=0" class="thumbnail_list_nodata">暂无数据</div>
            </el-col>
        </div>
        <!-- 创建文件夹弹框 -->
        <el-dialog
            title="创建文件夹"
            class="wjj_dialog"
            :visible.sync="isCreateWjjdialog"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handleWjjClose">
            <el-form :model="ruleFormWjj" :rules="wjjrules" ref="ruleFormWjj" label-width="100px" class="demo-ruleForm">
                <el-form-item label="文件夹名" prop="fileName">
                    <el-input placeholder="请输入文件名" v-model="ruleFormWjj.fileName"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input placeholder="请输入备注(200字以内)" type="textarea" rows="5" cols="7" v-model.trim="ruleFormWjj.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handlewjjresetCancel('ruleFormWjj')">取 消</el-button>
                    <el-button size="small" type="primary" @click="handlewjjsubmit('ruleFormWjj')" :loading="wjjLoading">保 存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 重命名弹框 -->
        <el-dialog
            title="重命名"
            class="wjj_dialog"
            :visible.sync="isrenameWjjdialog"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handlerenameClose">
            <el-form :model="renameWjj" :rules="renamewjjrules" ref="renameWjj" label-width="100px" class="demo-ruleForm">
                <el-form-item label="文件名" prop="renameFile">
                    <el-input placeholder="请输入文件名" v-model.trim="renameWjj.renameFile"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input placeholder="请输入备注(200字以内)" type="textarea" rows="5" cols="7" v-model.trim="renameWjj.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handlerenameCancel('renameWjj')">取 消</el-button>
                    <el-button size="small" type="primary" @click="handlerenamesubmit('renameWjj')" :loading="renameLoading">保 存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 移动文件 -->
        <el-dialog
            title="移动到"
            :visible.sync="isRemoveWjjdialog"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handleromoveWjjClose">
            <el-tree
                :data="allD_result"
                :props="defaultProps"
                default-expand-all
                accordion
                @node-click="handleRemoveNodeClick">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleromoveWjjClose">取 消</el-button>
                <el-button size="small" type="primary" @click="handleRomoveWjComfrim" :loading="r_loading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 复制文件 -->
        <el-dialog
            title="复制到"
            :visible.sync="iscopyWjjdialog"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handlecopyWjjClose">
            <el-tree
                :data="allD_result"
                :props="defaultProps"
                default-expand-all
                accordion
                @node-click="handlecopyNodeClick">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handlecopyWjjClose">取 消</el-button>
                <el-button size="small" type="primary" @click="handleCopyWjComfrim" :loading="copy_loading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 设置文件权限弹框 -->
        <el-dialog
            class="wjroot_dialog"
            :title="root_title"
            :visible.sync="isRootWjdialog"
            width="50%"
            :close-on-click-modal="false"
            :before-close="handleRootWjClose">
            <div class="root_head clearfix">
                <div class="root_h_l fl clearfix">
                    <a v-if="isOneRoot == 1" :class="{'root_h_active':isrootNav == 0}" @click="handleWjRootNav0">文件已有权限</a>
                    <a :class="{'root_h_active':isrootNav == 1}" @click="handleWjRootNav1">编辑文件权限</a>
                </div>
                <div class="root_h_r fr" @mouseenter="isRootPopver=true"  @mouseleave="isRootPopver=false">
                    <img src="../assets/icon_help.png" />
                    <div class="root_popover" v-if="isRootPopver">
                        1.文件管理员：指可对文件（夹）进行共同管理，拥有对文件（夹）进行管理权限（上传、下载/查看，删除、移动、复制、重命名、分享）。<div style="width:100%;height:14px;"></div>
                        2.查看权限：指对文件进行查看权限，拥有对文件（夹）进行查看/下载的权限。
                    </div>
                </div>
            </div>
            <div class="root_center">
                <!-- 文件已有权限div -->
                <ul class="root_c_div0" v-if="isOneRoot == 1 && isrootNav == 0">
                    <li class="root_div0_li flex-wrap" v-for="(item,index) in root_yylist" :key="index">
                        <div class="li_left flex-con flex-wrap flex-align-item">
                            <i></i>
                            <span class="p0">{{item.username}}</span>
                            <span class="p1">{{item.chName}}</span>
                            <span class="p2" v-if="item.authority == 1">文件管理员</span>
                            <span class="p2" v-if="item.authority == 0">查看权限</span>
                        </div>
                        <div class="li_right">
                            <a @click="handleRootEditClick">编辑</a>
                        </div>
                    </li>
                </ul>
                <!-- 编辑文件权限div  -->
                <div class="root_c_div1" v-if="isrootNav == 1">
                    <div class="root_div1_top"><el-checkbox @change="handleRootSoleset" v-model="is_r_checked">公开所有人可见</el-checkbox></div>
                    <div class="root_div1_bottom flex-wrap" v-if="!is_r_checked">
                        <div class="root_tree_left flex-con">
                            <div class="root_input_box">
                                <el-input placeholder="请输入搜索的成员（姓名或账号）" class="input-with-select input-search" size="small" 
                                    v-model.trim="root_keywords" @keyup.enter.native="enterSearchRoot" suffix-icon="el-icon-search">
                                </el-input>
                                <span class="search_btn" @click.stop="spikSearchRoot"></span>
                            </div>
                            <div class="root_tree_info">
                                <div class="el-dropdown-link root_tree_company">
                                    <i class="el-icon-arrow-down el-icon-caret-bottom" style="font-size:16px;"></i>
                                    {{corpName}}
                                </div>
                                <div class="root_tree">
                                    <div class="root_tree_li flex-wrap" v-for="(i,index) in root_allBlist" :key="index" :class="{'root_tree_li_active':i.isChecked}">
                                        <div class="root_t_li_left flex-con flex-wrap flex-align-item" @click.stop="handleCheckRootItem(i,index)">
                                            <i class="checkbox_model" :class="{'checkbox_model_active':i.isChecked}"></i>
                                            <p class="w-elli" style="width:10vw;">{{i.chName}}({{i.username}})</p>
                                        </div>
                                        <div class="root_t_li_right">
                                            <el-dropdown trigger="click" size="mini" @click.native="handleRootDropnav(index)" :class="{'color222':i.isChecked}">
                                                <div class="el-dropdown-link">
                                                   <span v-text="i.root_user_type==1?'文件管理员':'查看权限'"></span> <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
                                                </div>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :class="{'dropdown_active':i.root_user_type==0}" @click.native="handleRootDrop(i,index,0)">查看权限</el-dropdown-item>
                                                    <el-dropdown-item :class="{'dropdown_active':i.root_user_type==1}" @click.native="handleRootDrop(i,index,1)">文件管理员</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="root_tree_right flex-con">
                            <div class="root_tree_r_box">
                                <div class="tree_r_text" v-if="root_relList.length>0">已选择{{root_relList.length}}个人员</div>
                                <ul class="root_c_div0 tree_r_ul">
                                    <li class="root_div0_li tree_r_li flex-wrap" v-for="(item,index) in root_relList" :key="index">
                                        <div class="li_left flex-con flex-wrap flex-align-item">
                                            <i></i>
                                            <span style="width:10vw;" class="p1  w-elli">{{item.chName}} ({{item.username}})</span>
                                            <span class="p2" v-text="item.root_user_type==1?'文件管理员':'查看权限'"></span>
                                        </div>
                                        <div class="li_right">
                                            <a @click.stop="handleDeleteRelist(item,index)">删除</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleRootWjClose">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSaveRootComfrim" :loading="root_loading">保 存</el-button>
            </span>
        </el-dialog>
         <!-- 生成分享链接弹框 -->
        <el-dialog
            class="wjshare_dialog"
            title="生成分享链接"
            :visible.sync="isShareWjjdialog"
            width="600px"
            :close-on-click-modal="false"
            :before-close="handleShareWjjClose">
            <div class="share_dialog_box">
                <div class="share_item">
                    <div class="share_lable">有效时效：</div>
                    <div class="share_input_box flex-wrap">
                        <div class="share_shix_btn" :class="{'share_shix_btn_active':sharedate == 5}" @click="handleShareDate(5)">5天</div>
                        <div class="share_shix_btn" :class="{'share_shix_btn_active':sharedate == 7}" @click="handleShareDate(7)">7天</div>
                        <div class="share_shix_btn" :class="{'share_shix_btn_active':sharedate == 15}" @click="handleShareDate(15)">15天</div>
                        <div class="share_shix_btn" :class="{'share_shix_btn_active':sharedate == 'null'}" @click="handleShareDate('null')">永久</div>
                    </div>
                </div>
                <div class="share_item">
                    <div class="share_lable">分享链接：</div>
                    <div class="share_input_box flex-wrap">
                        <el-input placeholder="请生成链接并复制" size="small" v-model="shareUrl">
                            <template slot="append">链接<span v-text="sharedate == 'null' ? '永久':sharedate+'天后'"></span>失效</template>
                        </el-input>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align:center">
                <el-button size="small" type="primary" @click="handleShareComfrim" :loading="share_wjjLoading">生成链接并复制</el-button>
            </span>
        </el-dialog>

        <!-- 文件（夹）上传 -->
        <el-dialog
            class="wjroot_dialog wjload_dialog"
            title="上传文件（夹）"
            :visible.sync="isUpfileWjdialog"
            width="50%"
            :close-on-click-modal="false"
            :before-close="handleUploadWjClose">
            <div class="root_head clearfix">
                <div class="upload_item flex-wrap">
                    <div class="upload-left-lable">
                        <span>上传文件：</span>
                    </div>
                    <div class="upload-right flex-con">
                        <div class="">
                            <!-- <input title="浏览" id="h5Input2" multiple="" webkitdirectory=""
                            accept="*/*" type="file" name="html5uploader"
                            @change="handleuploadWj" ref="uploadInputer"> -->
                            <button @click="fileClick">浏览</button>
                            <label ref="upload" style="position: relative;">
                                <input v-if="is_upload_wj == 1" type="file" accept="*/*" multiple=""
                                    @change="selectFile"
                                    style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1;">
                                <input v-if="is_upload_wj == 0" type="file" accept="*/*" multiple="" webkitdirectory=""
                                    @change="selectFile"
                                    style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1;">
                            </label>
                            <span class="upload_tips">支持docx，xls，jpg等类型的文件</span>
                        </div>
                        <!-- 展示已上传的文件列表 -->
                       <div class="cleafix" style="width:100%;margin-top:5px;">
                           <!-- <el-progress percentage="90"></el-progress> -->
                           <el-progress :percentage="percentage_num" v-if="percentage_num > 0 && percentage_num <= 100"></el-progress>
                            <div v-if="percentage_num > 0 && percentage_num <= 100" class="fl upload_numdiv">已上传文件: {{files_all.length}}/{{files_all_length}}</div>
                            <div v-if="percentage_num > 0 && percentage_num <= 100" class="fl upload_speed">当前网速: {{upload_speed}}KB/s</div>
                            <!-- <div v-if="percentage_num > 0 && percentage_num <= 100" class="fl upload_speed">上传中,上传速度监控正在开发中</div> -->
                           <ul class="upload_ul">
                               <!-- -->
                               <li class="flex-wrap flex-align-item flex-hh-not" v-for="(item,index) in files_all" :key="index"
                                @mouseenter="spikEnterUploadli(index)" @mouseleave="spikLeaveUploadli">
                                    <p class="flex-con"><img class="fl" src="../assets/icon_attached.png"> <span class="elipseone">{{item.name}}</span></p>
                                    <i v-if="item.progress == 100" class="upload_wj_suc" :class="{'upload_wj_del':currUplaodli==index}" @click="spikUploadDel(item,index)"></i>
                                </li>
                           </ul>
                       </div>
                    </div>
                </div>
                <div class="upload_item flex-wrap">
                    <div class="upload-left-lable">
                        <span>备注：</span>
                    </div>
                    <div class="upload-right flex-con">
                        <textarea class="upload-r-textarea" name="" id="" cols="30" rows="10" maxlength="100" v-model="upload_description"></textarea>
                    </div>
                </div>
            </div>
            <div class="root_center">
                <div class="root_c_div1">
                    <!-- 上传文件（夹）权限操作 -->
                    <div class="root_div1_top"><el-checkbox @change="handleRootSoleset" v-model="is_r_checked">公开所有人可见</el-checkbox></div>
                    <div class="root_div1_bottom flex-wrap" v-if="!is_r_checked">
                        <div class="root_tree_left flex-con">
                            <div class="root_input_box">
                                <el-input placeholder="请输入搜索的成员（姓名或账号）" class="input-with-select input-search" size="small" 
                                    v-model.trim="root_keywords" @keyup.enter.native="enterSearchRoot" suffix-icon="el-icon-search">
                                </el-input>
                                <span class="search_btn" @click.stop="spikSearchRoot"></span>
                            </div>
                            <div class="root_tree_info">
                                <div class="el-dropdown-link root_tree_company">
                                    <i class="el-icon-arrow-down el-icon-caret-bottom" style="font-size:16px;"></i>
                                    {{corpName}}
                                </div>
                                <div class="root_tree">
                                    <div class="root_tree_li flex-wrap" v-for="(i,index) in root_allBlist" :key="index" :class="{'root_tree_li_active':i.isChecked}">
                                        <div class="root_t_li_left flex-con flex-wrap flex-align-item" @click.stop="handleCheckRootItem(i,index)">
                                            <i class="checkbox_model" :class="{'checkbox_model_active':i.isChecked}"></i>
                                            <p class="w-elli" style="width:10vw;">{{i.chName}}({{i.username}})</p>
                                        </div>
                                        <div class="root_t_li_right">
                                            <el-dropdown trigger="click" size="mini" @click.native="handleRootDropnav(index)" :class="{'color222':i.isChecked}">
                                                <div class="el-dropdown-link">
                                                   <span v-text="i.root_user_type==1?'文件管理员':'查看权限'"></span> <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
                                                </div>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :class="{'dropdown_active':i.root_user_type==0}" @click.native="handleRootDrop(i,index,0)">查看权限</el-dropdown-item>
                                                    <el-dropdown-item :class="{'dropdown_active':i.root_user_type==1}" @click.native="handleRootDrop(i,index,1)">文件管理员</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="root_tree_right flex-con">
                            <div class="root_tree_r_box">
                                <div class="tree_r_text" v-if="root_relList.length>0">已选择{{root_relList.length}}个人员</div>
                                <ul class="root_c_div0 tree_r_ul">
                                    <li class="root_div0_li tree_r_li flex-wrap" v-for="(item,index) in root_relList" :key="index">
                                        <div class="li_left flex-con flex-wrap flex-align-item">
                                            <i></i>
                                            <span style="width:10vw;" class="p1 w-elli">{{item.chName}} ({{item.username}})</span>
                                            <span class="p2" v-text="item.root_user_type==1?'文件管理员':'查看权限'"></span>
                                        </div>
                                        <div class="li_right">
                                            <a @click.stop="handleDeleteRelist(item,index)">删除</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleUploadWjClose">取 消</el-button>
                <el-button v-if="files_all.length <= 0" size="small" type="primary" disabled>保存</el-button>
                <el-button v-if="files_all.length > 0 && files_all.length != files_all_length" size="small" type="primary" disabled>文件上传中</el-button>
                <el-button v-if="files_all.length > 0 && files_all.length == files_all_length" size="small" type="primary" @click="handleSaveUploadComfrim" :loading="upload_loading">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 下载文件进度列表 -->
        <file-progress></file-progress>
        <!-- 图片预览查看 -->
        <viewer :images="viewer_imgs" ref="viewerFuj" @inited="initedFj" style="display:none;">
            <!-- viewer_imgs 一定要一个数组，否则报错 -->
            <img v-for="(src,index) in viewer_imgs" :src="src" :key="index">
        </viewer>
    </div>
</template>
<script>
import axios from "axios";
import { getData } from "../api/api.js";
import {downloadStore} from "../api/download_store.js";
import fileprogress from '../components/file_progress'
import {Dialog, unique} from "../api/util.js";
import { base64encode, utf16to8, utf8to16, base64decode } from "../api/base64";
import { construct, destruct } from '@aximario/json-tree';
import { uploadFile, abortFunc, progressArrFunc } from "../api/uploadFile";
import SparkMD5 from 'spark-md5'
export default {
    components:{
        'file-progress':fileprogress
    },
  data() {
    var validateWjj = (rule, value, callback) => {
        //中文、英文、数字但不包括下划线等符号
        // var wjjReg = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9]+$/).test(value);
        var wjjReg = RegExp(/^[^/:*?\"<>|]+$/).test(value);
        if (value === "") {
            callback(new Error("请输入文件夹名"))
        }else if(value.length>300){
            callback(new Error("请输入300字以内"))
        } else if(!wjjReg){
            callback(new Error("文件夹名非法,请重新定义"))
        }else{
            callback();
        }
    }
    return {
        //设置文件（夹）权限
        root_fileTarIds:[], //批量设置权限
        root_fileTarId:'', //单个设置权限
        isrootNav:0, //tab切换  0为已有文件权限 1为编辑权限
        isRootWjdialog:false,
        root_title:'',
        isOneRoot:0, //是否为单个设置文件 1是0否
        root_yylist:[], //已有文件权限人员列表
        root_allBlist:[], //所有员工列表
        corpName:'',//权限公司
        root_checked:1, //勾选全部时为0 ,否则为1
        is_r_checked:false, //勾选全部时为true ,否则为false
        root_keywords:null,
        root_user_type:0, //1文件管理员 0查看权限
        root_relList:[], //展示前台选中的员工
        root_relListJson:[], // 传后台选中的员工
        root_loading:false,
        isRootPopver:false,
        is_searchRoot:0, // 触发搜索成员信息 0无 1搜索
        //获取所有文件夹
        allDirectories: [],
        all_yuandata:[],
        allD_result:[],
        defaultProps: {
          children: 'children',
          label: 'fileName'
        },
        //重命名
        renameLoading:false,
        isrenameWjjdialog: false,
        rename_fileTarId:'',
        renameWjj: {
          sourceName:'',
          renameFile: '',
          suffix:'',
          description: ''
        },
        renamewjjrules: {
          renameFile: [
            { required: true, message: '请输入文件名', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入100字以内!', trigger: 'blur' }
          ],
          description: [
            { required: false, message: '请输入备注(200字以内)!', trigger: 'blur' },
            { min: 1, max: 200, message: '请输入200字以内!', trigger: 'blur' }
          ]
        },
        //创建文件夹
        wjjLoading:false,
        isCreateWjjdialog: false,
        ruleFormWjj: {
            fileName: '',
            description: ''
        },
        wjjrules: {
          fileName: [
            { required: true, validator: validateWjj, trigger: 'blur' }
          ],
          description: [
            { required: false, message: '请输入备注(200字以内)!', trigger: 'blur' },
            { min: 1, max: 200, message: '请输入200字以内!', trigger: 'blur' }
          ]
        },
        //移动文件
        all_fileTarId:null,
        r_loading:false,
        isRemoveWjjdialog:false,
        r_fileTarId:[],
        r_treeid:null,
        r_fileArr:[],
        r_toFileTarId:'',
        //删除文件
        d_fileTarId:[],
        //复制文件
        copy_loading:false,
        iscopyWjjdialog:false,
        copy_fileTarId:'',
        copy_parentFileId:'',
        copy_toFileTarId:'',
        copy_data:'',
        //数据参数
        keywords:'',
        isShowPath:false, //是否展示每个文件的路径
        isSearch:false, //判断是否触发了搜索
        corpAccId:null,
        empAccId:null,
        // fieldName:'',
        parentFileId:null,
        parentFileName:'',
        now_page:1,
        page_size:20,
        total_page:1,
        totalCount:1,
        page_txt:'加载更多',
        isHaveLoadMore:true,
        res_id:[],
        //排序
        order_by:'', //排序字段
        sort_type:'desc', //排序类型
        //表格
        isloadlist:true,
        loadlistTxt:'',
        isShowtable: true,
        tableData: [],
        multipleSelection: [],
        table_loading:true,
        defaultSort:{},
        //缩略图
        thumb_checkAll: false,
        currthumbindex: null,
        curradio: 0,
        currtdropdown: 0,
        radio_arrIds:[],
        //面包屑
        breadcrumbtitList:[],
        //分享链接
        isShareWjjdialog:false,
        ruleFormShareWjj:{
            shareExpireDates:5,
        },
        share_wjjLoading:false,
        sharedate:5, // 分享时效
        share_fileTarIds:null, //传后台数据
        share_fileTarId:'',
        shareUrl:'', //分享生成链接
        //文件（夹）下载
        download_fileTarIds:[], //传后台数据
        download_fileTarId:'',
        download_progress_all:[], //总进度
        download_filetype:'', //文件类型
        download_filesuffix:'', //文件后缀名
        download_filesize:0, // 文件大小 MB
        download_filesizeFormat:0, //文件大小 KB
        download_filename:'', //下载文件名
        is_d_progress:false, //进度条展示控制
        download_progress_list:[], //下载列表
        download_old_p_list:[],// 之前的下载列表获取
        download_p_list:[], //下载列表
        is_p_suox:false, //控制下载弹框是否缩小显示，
        //文件（夹）上传
        fileUp_authority:1, //文件夹是否有权限上传文件（夹）
        is_upload_wj:1, //1文件类型 0文件夹类型
        isUpfileWjdialog:false,
        upload_loading:false,
        percentage_num:0,
        upload_speed:0, //上传文件网速 kb/s
        files_all:[],
        files_all_length:0,
        filesize_all:1,//文件（多个/单个）总大小
        chunksize_all:1,//文件（多个/单个）分块总大小
        upload_fileTarId:'',
        upload_description:'',
        currUplaodli:null,
        //菜单资源权限
        isRbac_upload:false, //上传
        isRbac_fileRoot:false, //设置文件权限
        isRbac_down:false, //下载
        isRbac_collect:false, //收藏
        isRbac_share:false, //分享
        // isRbac_edit:false, //编辑
        isRbac_del:false, //删除
        isRbac_list:false, //列表
        isRbac_create:false, //创建文件夹
        isRbac_rename:false, //重命名
        isRbac_remove:false, //文件夹移动
        isRbac_copy:false, //文件复制
        //图片预览
        viewer_imgs:[],
        //对文件导航按钮操作控制
        //文件选中list
        file_list:[],
        isAuth:true,
    };
  },
  mounted() {
      let userData = sessionStorage.getItem("user")
      if(userData){
            let userDataJson = eval('(' + userData + ')')
            //   console.log(userDataJson.corpAccId)
            //   console.log(userDataJson.empAccId)
            this.corpAccId = userDataJson.corpAccId
            this.empAccId = userDataJson.empAccId
            this.getrbacData()
      }else{
          this.$router.push("/login")
      }
      if(this.$route.query.fileTarId){
        this.fileTarId = this.$route.query.fileTarId
        this.inittable()
      }
      let newbrod = sessionStorage.getItem("newbrod")
      if(newbrod){
          let newbrodJson = eval('(' + newbrod + ')')
          this.breadcrumbtitList = newbrodJson
      }
  },
  methods: {
    //菜单资源权限
    //菜单\功能\子功能操作权限
    getrbacData() {
        let that = this;
        getData("open/api/res/findResByEmpAcc", {
            'empAccId': this.empAccId
        }).then(res => {
            if (res.code == 200) {
                that.allmenu = res.data || [];
                that.menulistJson = construct(that.allmenu, {
                    id: "resTarId",
                    pid: "resParentId",
                    children: "children"
                });
                if(that.menulistJson.length > 0){
                    that.menulistJson.map((v,i)=>{
                        if(v.children && Object.prototype.toString.call(v.children).toLowerCase() === '[object array]' && v.children.length > 0){
                            v.children.map((val,idx)=>{
                                if(val.routePath == '/all_file'){
                                    //功能操作
                                    if(val.children && val.children.length>0){
                                        // console.log(JSON.stringify(val.children, null, "\t"))
                                        val.children.map((value,index)=>{
                                            if(value.resType == 'FUNC'){
                                                if(value.accessPath == "/web/file/share"){
                                                    that.isRbac_share = true;
                                                }
                                                if(value.accessPath == "/web/file/batchLogicDelete"){
                                                    that.isRbac_del = true;
                                                }
                                                if(value.accessPath == "/web/file/empAcc/**"){
                                                    that.isRbac_list = true;
                                                }
                                                if(value.accessPath == "/web/file/directory/create"){
                                                    that.isRbac_create = true;
                                                }
                                                if(value.accessPath == "/web/file/directory/rename"){
                                                    that.isRbac_rename = true;
                                                }
                                                if(value.accessPath == "/web/file/remove"){
                                                    that.isRbac_remove = true;
                                                }
                                                if(value.accessPath == "/web/file/copy"){
                                                    that.isRbac_copy = true;
                                                }
                                                if(value.accessPath == "/web/file/chunkUpload"){
                                                    that.isRbac_upload = true;
                                                }
                                                if(value.accessPath == "/web/file/authorityEdit"){
                                                    that.isRbac_fileRoot = true;
                                                }
                                                if(value.accessPath == "/web/file/preUpload"){
                                                    // that.isRbac_down = true;
                                                }
                                                if(value.accessPath == "/web/file/empAcc/collect"){
                                                    that.isRbac_collect = true;
                                                }
                                            }
                                        })
                                        if(!that.isRbac_list){
                                            that.$router.push({ path: "/403" });
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
                that.inittable()
            }
        });
    },
    //表格列表数据
    inittable() {
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':this.fileTarId,
            'page':this.now_page,
            'size':this.page_size,
        }
        this.isloadlist = true;
        this.ajaxtable(param)
    },
    ajaxtable(param,isLoadMore){
        this.r_fileTarId = [];
        this.d_fileTarId = [];
        this.root_fileTarIds = [];
        isLoadMore = typeof isLoadMore === 'undefined' || isLoadMore == false ? false : true;
        let that = this;
        // this.$refs.multipleTable.bodyWrapper.removeEventListener('scroll')
        getData("web/file/empAcc/files", param).then(res => {
            that.isloadlist = false;
            that.table_loading = false;
            if (res.code == 200) {
                if(that.isSearch){
                    that.isShowPath = true;
                }else{
                    that.isShowPath = false;
                }
                let datajson = res.data || []
                let data = datajson.map(function(v,i){
                    if(that.isShowPath){
                        if(v.visitUrl.indexOf(res.parentFileName)>-1){
                            let arr_visitUrl = v.visitUrl.split('/'+res.parentFileName+'/');
                            let string_v_url = arr_visitUrl[arr_visitUrl.length-1]
                            string_v_url = string_v_url.substr(0,string_v_url.lastIndexOf('/'))
                            v.visitUrl = '全部文件/'+string_v_url

                            // let arr_idpath = v.idPath.split('/'+res.parentFileId+'/');
                            // let string_id_path = arr_idpath[arr_idpath.length-1]
                            // string_id_path = string_id_path.substr(0,string_id_path.lastIndexOf('/'))
                            // v.idPath=string_id_path
                        }
                    }
                    that.$set(v, 'isChecked', false)
                    return v;
                })
                if(!isLoadMore){
                    that.tableData = data || [];
                }else{
                    that.tableData = that.tableData.concat(data);
                }
                that.total_page = res.pages < 1 ? 1 : res.pages;
                that.totalCount = res.totalCount;
                that.now_page = res.currentPage < 1 ? 1 : res.currentPage;
                if(that.now_page >= that.total_page){
                    that.table_loading=false;
                    that.page_txt=""
                }else{
                    that.table_loading=false;
                    that.page_txt="加载更多"
                }
                 // that.parentFileId = res.data.length>0?res.data[0].parentFileId:that.fileTarId;parentFileId
                that.parentFileId = res.parentFileId;
                that.parentFileName = res.parentFileName;
                // that.isHaveLoadMore = that.total_page > that.now_page ? true : false;
            } else {
                if (res.code == 1001) {
                    Dialog.message(res.message,'error',1500)
                    that.$router.push({ path: "/403" });
                }
            }
        });
    },
    appendTable() {
        if(this.total_page > this.now_page){
            ++this.now_page
            this.table_loading=true;
            let param={
                'corpAccId':this.corpAccId,
                'empAccId':this.empAccId,
                'fileTarId':this.fileTarId,
                'page':this.now_page,
                'size':this.page_size,
            }
            this.ajaxtable(param,true);
        }else{
            this.table_loading=false;
            this.page_txt=""
        }
        //   this.tableData.push(_tableData);
    },
    //面包屑
    handleAllFilebreadb(){
        this.breadcrumbtitList = [];
        this.now_page = 1;
        this.fileUp_authority=1;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':null,
            'page':this.now_page,
            'size':this.page_size,
        }
        this.fileTarId = null;
        this.isSearch=false;
        this.keywords = '';
        this.ajaxtable(param)
    },
    handleItemFilebreadb(fileTarId,index){
        let that = this,num= index+1;
        this.breadcrumbtitList.splice(num,this.breadcrumbtitList.length-num);
        // console.log(JSON.stringify(this.breadcrumbtitList,null,'\t'))
        this.fileTarId = fileTarId;
        this.now_page = 1;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':this.fileTarId,
            'page':this.now_page,
            'size':this.page_size,
        }
        this.isSearch=false;
        this.keywords = '';
        this.ajaxtable(param)
    },
    //获取所有文件夹结构
    //获取根目录
    ajaxRootDirectory(){
        let that = this;
        getData("web/file/empAcc/allDirectories", {
            'corpAccId':that.corpAccId,
            'empAccId':that.empAccId,
            'fileTarId':that.all_fileTarId
        }).then(res => {
            if (res.code == 200) {
                that.all_yuandata = that.all_yuandata.concat(res.data)
                if(res.data.length > 0){
                    that.all_fileTarId = res.data[0].fileTarId
                    that.ajaxAallDirectories()
                }
            }
        })
    },
    //获取根目录下的所有文件夹结构
    ajaxAallDirectories(){
        let that = this;
        getData("web/file/empAcc/allDirectories", {
            'corpAccId':that.corpAccId,
            'empAccId':that.empAccId,
            'fileTarId':that.all_fileTarId
        }).then(res => {
            if (res.code == 200) {
                let data_arr = res.data || [];
                if(data_arr.length > 0){
                    //对选中文件夹进行过滤
                    let data_s = data_arr.filter((item,index) =>{
                        return !that.r_fileArr.some((v,i)=>{
                            if(item.fileTarId == v.fileTarId || item.parentFileId == v.fileTarId){
                                return true
                            }
                        })
                    })
                    that.all_yuandata = that.all_yuandata.concat(data_s)
                    //去文件夹去重
                    // var result = [];
                    // var obj = {};
                    // for(var i =0; i<that.all_yuandata.length; i++){
                    //     if(!obj[that.all_yuandata[i].fileTarId]){
                    //         result.push(that.all_yuandata[i]);
                    //         obj[that.all_yuandata[i].fileTarId] = true;
                    //     }
                    // }
                    that.allDirectories=that.all_yuandata || []
                    let p_item = construct(JSON.parse(JSON.stringify(that.allDirectories)), {
                        id: 'fileTarId',
                        pid: 'parentFileId',
                        children: 'children'
                    })
                    that.allD_result = p_item
                }
            }
        })
    },
    //没有权限的文件夹进行过滤
    fnFormatData(arr1,arr2 = {}){
        let index = 0,that = this;
        if(arr1['children']){
            for(let key in arr1){
                if(key === 'children'){
                    arr2[key] = []
                }else{
                    arr2[key] = arr1[key];
                }
            }
            arr1['children'].forEach((val,i) => {
                if(val.authority == 1){
                    if(val['children'] && Array.isArray(val['children']) && val['children'].length > 0){
                        arr2['children'][index] = {};
                        that.fnFormatData(val,arr2['children'][index])
                        ++index;
                    }else{
                        if(val){arr2['children'].push(val);}
                    }
                }
            })
            return arr2;
        }else{
            return arr1;
        }
    },
    //文件（夹）上传
    //关闭
    handleUploadWjClose(){
        this.isUpfileWjdialog = false;
        abortFunc(1)
        this.percentage_num = 0
        this.files_all=[]
        if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
        let that = this;
        if(this.root_fileTarIds.length>0){
        let folderMd5=downloadStore.state.message.folderMd5;
            getData("/web/file/uploadCancel", {
                'fileTarIds':this.root_fileTarIds,
                 'folderMd5':folderMd5
            }).then(res => {
                if (res.code == 200) {
                    that.root_fileTarIds=[]
                }
            })
        }
    },
    //文件上传
    handleUploadWj(){
        if(this.fileUp_authority == 1){
            this.is_upload_wj = 1;
            this.isUpfileWjdialog= true;
            this.percentage_num=0
            // this.upload_fileTarId = '';
            this.root_checked = 0;
            this.is_r_checked = true;
            this.files_all=[];
            abortFunc(0)
            progressArrFunc([])
            // this.root_fileTarIds = []
            this.upload_description='';
            this.is_searchRoot = 0;
            this.isOneRoot = 0;
            this.root_relList=[];
            this.root_relListJson=[];
            this.ajaxAllBriefInfo();
        }else{
            Dialog.message('您没有当前文件夹的操作权限!','error',1500)
        }
    },
    //文件夹上传
    handleUploadWjjia(){
        if(this.fileUp_authority == 1){
            this.is_upload_wj = 0;
            this.isUpfileWjdialog= true;
            this.percentage_num=0
            this.root_checked = 0;
            this.is_r_checked = true;
            this.files_all=[];
            abortFunc(0)
            progressArrFunc([])
            // this.root_fileTarIds=[]
            this.upload_description='';
            this.is_searchRoot = 0;
            this.isOneRoot = 0;
            this.root_relList=[];
            this.root_relListJson=[];
            this.ajaxAllBriefInfo();
        }else{
            Dialog.message('您没有当前文件夹的操作权限!','error',1500)
        }
    },
    // 导出进度条随机数
    sum: function(m, n) {
      let num = Math.floor(Math.random() * (m - n) + n);
      return num;
    },
    //触发上传选择文件（夹）
    fileClick() {
        // 模拟点击file input触发选择文件，注意：不能在任何方式的回调里面执行此语句
        this.$refs.upload.click()
        // progressArrFunc([])
        this.percentage_num=0
        this.files_all_length=this.files_all.length
    },
    selectFile(event) {
        // console.log(event.target.files)
        // console.log(event.target.files.length)
        // name: "database-cas1.jar"
        // size: 138822705
        // type: ""
        // webkitRelativePath: "大文件/database-cas1.jar"
        let that = this,totalSize = 0, g_size = 5368709120, z_size=1073741824 // 1G; 
        for (let i = 0; i < event.target.files.length; i++) {
            totalSize=totalSize+event.target.files[i].size;
            that.filesize_all = that.filesize_all+event.target.files[i].size
        }
        // console.log(totalSize)
        // console.log(g_size+'---g_size----')
        if(totalSize < g_size){
            if(totalSize > z_size){
                this.$confirm('文件大小已超1G，超大文件的上传可能会很慢哦，需耐心等待，您确定上传么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.ajaxUpload(event)
                }).catch(() => {
                    //取消
                });
            }else{
                this.ajaxUpload(event)
            }
        }else{
            Dialog.message('请选择小于5G的文件进行上传!','error',2000)
        }
        // 重置file input控件的值
        // event.target.value = ''
    },
    ajaxUpload(event){
        var that = this, i = 0;
        this.files_all_length = event.target.files.length+this.files_all.length
        if(this.files_all_length <= 1000){
            
            this.percentage_num = 1
            // this.filesize_all = 0
            this.uploadFilefunc(i,event)
        }else{
            that.percentage_num=0
            that.files_all_length=0
            Dialog.message('文件个数已超过1000，请分批次进行上传!','error',2000)
        }
        // 重置file input控件的值
        // event.target.value = ''
    },
    uploadFilefunc(i,event){
        var that = this;
        if (i == event.target.files.length) {
            return;
        }
        // 调用上传方法，传入选择的文件对象
        uploadFile(event.target.files[i], this.empAccId, this.corpAccId, this.parentFileId, 0 ,(files,progress,isLast,response) => {
            // upload-success
            let responseJson = eval('(' + response + ')');
            if(responseJson.code == 200){
                // console.log(files)
                that.root_fileTarIds=that.root_fileTarIds.concat(responseJson.data.fileTarIds);
                that.uploadFilefunc(++i,event)
                // _this.imgFilter(++i, imgarr);
            }else{
                --that.files_all_length
                if(responseJson.code == 2000){
                    if (document.getElementsByClassName('el-message').length === 0) {
                        Dialog.message('您上传的文件名已被使用（含公司其他账号），请重新命名上传!','error',1500)
                    }
                }else{
                    Dialog.message(responseJson.message,'error',1500)
                }
                if(isLast == 1){
                    that.percentage_num=0;
                }
            }
        },(p_arr,isLast)=>{
            // 文件进度条
            that.chunksize_all = 0
            // console.log(JSON.stringify(p_arr, null, '\t'))
            p_arr.forEach((item,index)=>{
                // that.filesize_all=Number(that.filesize_all)+Number(item.filesize) <= 0 ? 1:Number(that.filesize_all)+Number(item.filesize)
                that.chunksize_all=Number(that.chunksize_all)+Number(item.chunksize) <= 0 ? 1:Number(that.chunksize_all)+Number(item.chunksize)
            })
            that.files_all=p_arr
            that.files_all = that.files_all.filter(item=>item.progress == 100)
            // let files_all_filter = that.files_all.filter(item=>item.progress == 100)
            // let progress = parseInt(that.files_all.length / p_arr.length * 100)
            let progress = parseInt(that.chunksize_all / that.filesize_all * 100) > 1 ? parseInt(that.chunksize_all / that.filesize_all * 100) : 1
            setTimeout(() => {
                that.percentage_num = progress > 100 ? 100 : progress
                if(isLast == 1){
                    if(that.files_all.length > 0 && that.files_all.length == that.files_all_length){
                        if(that.percentage_num < 100){
                            that.percentage_num= 100
                        }
                    }
                }
                if(that.percentage_num == 100){
                    setTimeout(() => {
                        that.percentage_num= 101
                    }, 1000);
                }
                // console.log(that.percentage_num)
            }, 400)
        },(status,isLast)=>{
            //预请求报错处理
            if(status == 0){
                that.percentage_num=0
                --that.files_all_length
            }
        },(speed)=>{
            //上传文件网速
            // console.log(speed + " KB/s");
            that.upload_speed = speed
        })

        // for (let i = 0; i < event.target.files.length; i++) {
        //     // console.log(that.filesize_all)
            
        // }
    },
    //文件（夹）保存
    handleSaveUploadComfrim(){
        let that = this;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'relList':this.root_relListJson,
            'soleSet':this.root_checked,
            'fileTarIds':this.root_fileTarIds,
            'description':this.upload_description
        };
        // console.log(JSON.stringify(param,null,'\t'))
        
        if(this.files_all.length > 0){
            // if(this.files_all.length == this.files_all_length){
                this.upload_loading=true;
                getData("web/file/filesAuthEdit", param).then(res => {
                    if (res.code == 200) {
                        Dialog.message('设置文件（夹）权限成功!','success',1500)
                        that.now_page=1;
                        that.inittable();
                        that.isUpfileWjdialog=false;
                    }else{
                        Dialog.message(res.message,'error',1500)
                    }
                    setTimeout(() => {
                        that.upload_loading = false;
                    }, 3000);
                }); 
            // }else{
            //     Dialog.message('还有文件未上传完!','error',1500)
            // }
        }else{
            Dialog.message('请上传文件!','error',1500)
        }
    },
    //上传中文件删除
    //鼠标移入效果
    spikEnterUploadli(index){
        this.currUplaodli=index
    },
    //鼠标移出效果
    spikLeaveUploadli(){
        this.currUplaodli=null
    },
    //上传文件删除
    spikUploadDel(item,index){
        let that = this;
        getData("web/file/uploadDelete", {
            'md5':item.filemd5
        }).then(res => {
            if (res.code == 200) {
                that.percentage_num=0
                that.files_all.splice(index, 1)
                --that.files_all_length
                if(that.root_fileTarIds.length > 0){
                    that.root_fileTarIds.map((v,i)=>{
                        if(v == res.data){
                            that.root_fileTarIds.splice(i,1)
                        }
                    })
                }
                progressArrFunc(item.filemd5)
            }
        });
    },
    //文件（夹）下载
    //批量下载
    handledownloadWjHead(){
        if(this.download_fileTarIds.length > 0){
            // this.is_d_progress=true
            // this.is_p_suox=false
            this.preDownloadWj()
        }else{
            Dialog.message('请选择下载的文件/文件夹!','error',1500)
        }
    },

    //单个下载
    handledownloadWj(row){
        let that = this;
        this.download_fileTarIds = [];
        this.download_fileTarIds.push( row.fileTarId)
        this.download_fileTarId = row.fileTarId;
        // this.is_d_progress=true;
        // this.is_p_suox=false
        this.preDownloadWj()
    },
    //预下载
    preDownloadWj(){
        let that = this
        getData("/open/api/file/preDownload", {
            'empAccId':this.empAccId,
            'fileTarIds':this.download_fileTarIds
        }).then(res => {
            if (res.code == 200) {
                that.download_filetype =res.data.type
                that.download_filesuffix =res.data.suffix
                that.download_filesizeFormat = res.data.sizeFormat
                that.download_filesize = Number(res.data.size)
                that.download_filename = res.data.fileName
                let row = res.data
                that.is_d_progress=true
                that.is_p_suox=false
                if(that.download_progress_list.length > 0){
                    var ret2 = that.download_progress_list.findIndex((v) => {
                        return row.fileName == v.name;
                    })
                    if(ret2 <= -1){
                        // 当返回-1时，则说明objArr中没有
                        that.ajaxDownloadWj(row)
                    }
                }else{
                    that.ajaxDownloadWj(row)
                }
            }
        });
    },
    ajaxDownloadWj(row){
        this.download_progress_list.push({
            // 'id':row.fileTarId,
            'type':row.type,
            'suffix':row.suffix,
            'sizeFormat':row.sizeFormat,
            'size': row.size,
            'name':row.fileName,
            'progress':0
        })
        this.xhrDownloadWj(row)
    },
    xhrDownloadWj(row){
        let that=this,download_speed=0;//下载文件网速 kb/s
        // let f_name = encodeURI(encodeURI(row.fileName))
        let f_name = encodeURI(row.fileName)
        let ajaxUrl = axios.defaults.baseURL+'web/file/download?empAccId='+this.empAccId+'&fileTarIds='+this.download_fileTarIds+'&fileName='+f_name;
        let startTime, endTime, fileSize, d_currt=0; // 下载文件网速
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ajaxUrl);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        startTime = Date.now();
        xhr.onprogress = function (event) {
            if(row.size > 0){
              var progress = parseInt(event.loaded / row.size * 100)
            }else{
              var progress = 100
            }
            // 文件下载网速
            ++d_currt
            endTime = Date.now();
            fileSize = event.loaded;
            let time = endTime - startTime
            if(time > 0){
                var speed = fileSize / (time / 1000) / 1024;
            }
            download_speed = Number.isInteger(d_currt / 9) ? Math.floor(speed) : download_speed <=0 ? Math.floor(speed) : download_speed
            //文件下载网速结束

            var p_arr = that.download_progress_list.map((v,i)=>{
                if(row.fileName == v.name){
                    v.progress = progress >= 100 ? 100 : progress,
                    v.d_speed = download_speed
                }
                return v
            })
            that.download_p_list = p_arr

            let store_msg={
                'download_p_list':that.download_p_list,
                // 'startTime':startTime
            }
            downloadStore.setMessageAction(store_msg)
        };
        let store_p_msg = {
            'is_d_progress':true,
            'is_p_suox':false
        }
        downloadStore.setMessageItem(store_p_msg)
        xhr.onload = function (oEvent) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //争对空文件（0kb）做处理，进度条直接100%
                if(row.size <= 0){
                    var p_arr = that.download_progress_list.map((v,i)=>{
                            if(row.fileName == v.name){
                                v.progress = 100,
                                v.d_speed = 10
                            }
                            return v
                        })
                    that.download_p_list = p_arr
                    let store_msg={
                        'download_p_list':that.download_p_list,
                        // 'startTime':startTime
                    }
                    downloadStore.setMessageAction(store_msg)
                }

                var blob = new Blob([xhr.response]);
                var csvUrl = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = csvUrl;
                link.download = row.fileName;
                link.click();

                //判断下载文件浏览器已经操作下载，但进度条未到100%，执行处理
                let p_list = that.download_p_list.map((item,index)=>{
                  if(item.name == row.fileName && item.progress < 100){
                    item.progress = 100
                  }
                  return item
                })
                let store_msg={
                  'download_p_list':p_list
                }
                downloadStore.setMessageAction(store_msg)
            }
        }
        xhr.send();
    },
    //分享链接
    handleShareWj(row){
        this.share_fileTarIds = null;
        this.isShareWjjdialog=true;
        this.share_fileTarId = row.fileTarId;
        // this.share_fileTarIds.push(row.fileTarId)
        this.share_fileTarIds = row.fileTarId
    },
    //分享有效时效
    handleShareDate(date){
        this.sharedate = date;
        this.shareUrl = ''
    },
    //生成链接提交
    handleShareComfrim(e){
        let that = this;
        this.share_wjjLoading=true;
        let ajaxUrl = axios.defaults.baseURL+'web/file/share';
        $.ajax({
            type:"POST",
            xhrFields: {
                withCredentials: axios.defaults.withCredentials
            },
            async:false, // 复制链接功能针对浏览兼容必须同步
            contentType: "application/json",
            url:ajaxUrl,
            data:JSON.stringify({
                'empAccId':this.empAccId,
                'fileTarId':this.share_fileTarIds,
                'shareExpireDates':this.sharedate
            }),
            success:function(res) {
                // console.log(res);
                if(res.code == 200 && res.data){
                    that.$copyText(res.data).then(function (e) {
                        Dialog.message('生成链接成功，去复制粘贴分享吧!','success',3000)
                    })
                    that.shareUrl = res.data;
                }
                setTimeout(() => {
                    that.share_wjjLoading=false;
                }, 2000);
            },
            error:function(e){
                that.share_wjjLoading=false;
            }
        });
    },
    handleShareonError(e){

    },
    //关闭
    handleShareWjjClose(){
        this.isShareWjjdialog = false;
        this.shareUrl = '';
       if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    //设置文件（夹）权限
    //tab切换
    handleWjRootNav0(){
        this.isrootNav = 0;
    },
    handleWjRootNav1(){
        this.isrootNav = 1;
    },
    //批量设置权限
    handleRootWjHead(){
        if(this.fileUp_authority == 1){
            if(this.root_fileTarIds.length>0){
                this.root_yylist = [];
                this.root_fileTarId='';
                this.root_keywords='';
                this.root_relList=[];
                this.root_relListJson=[];

                this.isOneRoot = 0;
                this.is_searchRoot = 0;
                this.isrootNav = 1;
                this.root_title="批量设置文件(夹)权限";
                this.isRootWjdialog=true;
                this.ajaxAllBriefInfo();
            }else{
                Dialog.message('请选择要设置的文件/文件夹!','error',3000)
            }
        }else{
            Dialog.message('您没有当前文件夹的操作权限!','error',3000)
        }
    },
    //单个设置权限
    handleSetRootwj(row,iconPath){
        //iconPath 是否是点击图标 1是 0否
        this.root_yylist = [];
        this.root_fileTarIds = [];
        this.root_fileTarId='';
        this.root_keywords='';
        this.root_relList=[];
        this.root_relListJson=[];

        this.root_fileTarId = row.fileTarId;
        if(row.type == 0){
            this.root_title = '设置'+row.fileName+'文件夹权限';
        }else{
            this.root_title = '设置'+row.fileName+'权限';
        }
        this.root_checked = row.soleSet == 1 ? 1 : 0;
        this.is_r_checked = row.soleSet == 1 ? false : true;
        this.is_searchRoot = 0;
        this.isOneRoot = 1;
        this.isrootNav = iconPath == 1?0:1;
        this.isRootWjdialog=true;
        this.ajaxGetAllAuthorities();
    },
    //获取文件已有权限
    ajaxGetAllAuthorities(){
        let that = this;
        getData("web/file/empAcc/getAllAuthorities", {
            'fileTarId':that.root_fileTarId
        }).then(res => {
            if (res.code == 200) {
                that.root_yylist = res.data || [];
                that.ajaxAllBriefInfo();
            }
        });
    },
    // 获取所有员工信息
    ajaxAllBriefInfo(){
        let that = this;
        getData("web/file/empAcc/allBriefInfo", {
            'corpAccId':this.corpAccId,
            'usernameOrChName':this.root_keywords
        }).then(res => {
            if (res.code == 200) {
                that.corpName = res.data.corpName || '';
                // root_user_type
                if(res.data.allBriefInfo.length>0){
                    that.root_allBlist = res.data.allBriefInfo.map(function(v,i){
                        that.$set(v, 'root_user_type', 0)
                        that.$set(v, 'isChecked', false)
                        if(that.isUpfileWjdialog){
                            if(that.empAccId == v.empAccId){
                                that.$set(v, 'root_user_type', 1)
                                that.$set(v, 'isChecked', true)
                                that.root_relList.push(v)
                                that.root_relListJson.push({
                                    'empAccId':v.empAccId,
                                    'fileAuthority':v.root_user_type
                                })
                            }
                        }
                        if(that.isOneRoot == 1){
                            if(that.is_searchRoot != 1){
                                that.root_yylist.map((val,index)=>{
                                    if(val.empAccId == v.empAccId){
                                        that.$set(v, 'isChecked', true)
                                        if(val.authority == 1){
                                            that.$set(v, 'root_user_type', 1)
                                        }
                                        that.root_relList.push(v)
                                        that.root_relListJson.push({
                                            'empAccId':v.empAccId,
                                            'fileAuthority':v.root_user_type
                                        })
                                        //勾选全部时为0 ,否则为1
                                        // that.root_checked = that.root_relList.length > 0 ? 1 : 0;
                                        // that.is_r_checked = that.root_relList.length > 0 ? false : true;
                                    }
                                })
                            }
                        }
                        if(that.is_searchRoot == 1){
                            //搜索成员信息处理
                            if(that.root_relList.length > 0){
                                that.root_relList.forEach((val,index)=>{
                                    if(val.empAccId == v.empAccId){
                                        that.$set(v, 'isChecked', true)
                                        that.$set(v, 'root_user_type', val.root_user_type)
                                    }
                                })
                            }
                        }
                       return v;
                    })
                }else{
                    that.root_allBlist = [];
                }
                // console.log( JSON.stringify( this.root_allBlist, null, '\t'))
                // console.log( JSON.stringify( this.root_yylist, null, '\t'))
            }
        });
    },
    //编辑权限
    handleRootEditClick(){
        this.isrootNav = 1;
    },
    //关闭
    handleRootWjClose(){
        this.isRootWjdialog=false;
       if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    //是否单独设置权限
    handleRootSoleset(val){
        let that = this;
        this.root_checked = val ? 0 : 1;
        this.is_r_checked = val ? true : false;
        if(val){
            // this.root_relList = [];
            // this.root_relListJson = [];
            // this.root_allBlist = this.root_allBlist.map(function(v,i){
            //     that.$set(v, 'root_user_type', 0)
            //     that.$set(v, 'isChecked', false)
            //     return v;
            // })
        }
    },
    //文件收藏(取消收藏)
    //设置文件收藏(取消收藏)
    handleSetCollectwj(row){
        let that = this;
        getData("web/file/empAcc/collect", {
            'fileTarId':row.fileTarId,
            'empAccId':this.empAccId,
            'collected':row.collected == 1 ? 0 : 1
        }).then(res => {
            if (res.code == 200) {
                if(row.collected==0){
                    Dialog.message('收藏成功!','success',1500)
                }else{
                    Dialog.message('取消收藏!','success',1500)
                }
                that.now_page=1;
                that.inittable();
            }else{
                Dialog.message('收藏失败!','error',1500)
            }
        });
    },
    //搜索成员
    //回车
    enterSearchRoot(){
        this.is_searchRoot = 1;
        this.ajaxAllBriefInfo();
    },
    spikSearchRoot(){
        this.is_searchRoot = 1;
        this.ajaxAllBriefInfo();
    },
    //选择员工权限
    handleRootDropnav(index){
    },
    handleRootDrop(item,index,command){
        
        this.root_allBlist[index].root_user_type = command;
        let that = this, ids=[];
        if(this.root_allBlist[index].isChecked){
            this.root_relList.map(function (v,i) {
                if(v.empAccId == that.root_allBlist[index].empAccId){
                    v.root_user_type = command;
                }
            })
            //处理json数据
            this.root_relList.map((item)=>{
                ids.push({
                    'empAccId':item.empAccId,
                    'fileAuthority':item.root_user_type
                })
            })
            // console.log(JSON.stringify(this.root_relList,null,'\t'))
        }else{
            this.root_relList.map(function (v,i) {
                if(v.empAccId == that.root_allBlist[index].empAccId){
                    if(i>-1){
                        that.root_relList.splice(i,1)
                    }
                }
            })
            //处理json数据
            this.root_relList.map((item)=>{
                ids.push({
                    'empAccId':item.empAccId,
                    'fileAuthority':item.root_user_type
                })
            })
            // console.log(JSON.stringify(this.root_relList,null,'\t'))
        }
        this.root_relListJson = ids;
        // console.log(JSON.stringify(this.root_relListJson,null,'\t'))
    },
    //配置员工权限
    handleCheckRootItem(item,index){
        let that = this, ids=[];
        this.root_allBlist[index].isChecked = !this.root_allBlist[index].isChecked;
        if(this.root_allBlist[index].isChecked){
            this.root_relList.push(item)
        }else{
            this.root_relList.map(function (v,i) {
                if(v.empAccId == item.empAccId){
                    if(i>-1){
                        that.root_relList.splice(i,1)
                    }
                }
            })
        }
        this.root_relList.map((item)=>{
            ids.push({
                'empAccId':item.empAccId,
                'fileAuthority':item.root_user_type
            })
        })
        // console.log(JSON.stringify(this.root_relList,null,'\t'))
        this.root_relListJson = ids;
        // console.log(JSON.stringify(this.root_relListJson,null,'\t'))
    },
    //删除选中的员工
    handleDeleteRelist(item,index){
        this.root_relList.splice(index,1);
        this.root_relListJson.splice(index,1);
        let that = this;
        this.root_allBlist.map((v,i)=>{
            if(v.empAccId == item.empAccId){
                that.root_allBlist[i].isChecked = false;
            }
        })
        // this.root_allBlist[index].isChecked
    },
    //保存权限
    handleSaveRootComfrim(){
        let that = this,ajaxurl,
            param={
                'corpAccId':this.corpAccId,
                'empAccId':this.empAccId,
                'relList':this.root_relListJson,
                'soleSet':this.root_checked
            };
        if(this.isOneRoot == 1){
            //单个权限设置
            param.fileTarId=this.root_fileTarId;
            ajaxurl = 'fileAuthEdit'
        }else{
            //批量权限设置
            param.fileTarIds=this.root_fileTarIds;
            ajaxurl = 'filesAuthEdit'
        }
        this.root_loading=true;
        getData("web/file/"+ajaxurl, param).then(res => {
            if (res.code == 200) {
                Dialog.message('设置文件（夹）权限成功!','success',3000)
                that.now_page=1;
                that.inittable();
                that.isRootWjdialog=false;
            }else{
                Dialog.message(res.message,'error',3000)
            }
            setTimeout(() => {
                that.root_loading = false;
            }, 3000);
        })
    },
    //重命名
    handleRenameWj(row){
        this.renameWjj.sourceName = row.fileName;
        this.renameWjj.suffix = row.suffix;
        this.renameWjj.renameFile=row.fileName.replace(row.suffix,'');
        this.renameWjj.description=row.description;
        this.rename_fileTarId = row.fileTarId;
        this.isrenameWjjdialog=true;
    },
    handlerenameClose(done) {
        this.isrenameWjjdialog=false;
    },
    handlerenamesubmit(formName) {
        let that = this;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':this.rename_fileTarId,
            'sourceName':this.renameWjj.sourceName,
            'renameFile':this.renameWjj.renameFile+this.renameWjj.suffix,
            'description':this.renameWjj.description,
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.renameLoading=true;
            getData("web/file/directory/rename", param).then(res => {
                if (res.code == 200) {
                    Dialog.message('重命名成功!','success',1500)
                    that.now_page=1;
                    that.inittable();
                    that.$refs[formName].resetFields();
                } else {
                    Dialog.message('重命名失败!','error',1500)
                }
                that.isrenameWjjdialog=false;
                setTimeout(() => {
                    that.renameLoading=false;
                }, 3000);
            });
          } else {
            return false;
          }
        });
    },
    handlerenameCancel(formName) {
        this.$refs[formName].resetFields();
        this.isrenameWjjdialog=false;
        if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    //创建文件夹
    handleWjjOpenHead(){
        if(this.fileUp_authority == 1){
            this.isCreateWjjdialog=true
        }else{
            Dialog.message('您没有当前文件夹的操作权限!','error',3000)
        }
    },
    handleWjjClose(done) {
        this.isCreateWjjdialog=false;
        this.clearVail('ruleFormWjj');
    },
    //清除验证
    clearVail(ref){
        this.$refs[ref].clearValidate();
    },
    handlewjjsubmit(formName) {
        let that = this;
        let param={
            'corpAccId':this.corpAccId,
            'parentFileId':this.parentFileId,
            'fileName':this.ruleFormWjj.fileName,
            'description':this.ruleFormWjj.description,
            'owner':this.empAccId
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.wjjLoading=true;
            getData("web/file/directory/create", param).then(res => {
                if (res.code == 200) {
                    Dialog.message('文件夹创建成功!','success',1500)
                    that.now_page=1;
                    that.inittable();
                } else {
                    Dialog.message('文件夹创建失败，请检查文件夹名格式是否正确!','error',3000)
                }
                that.isCreateWjjdialog=false;
                that.$refs[formName].resetFields();
                setTimeout(() => {
                    that.wjjLoading=false;
                }, 3000);
            });
          } else {
            return false;
          }
        });
    },
    handlewjjresetCancel(formName) {
        this.$refs[formName].resetFields();
        this.isCreateWjjdialog=false;
        if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    //移动到
    handleRomoveWjHead(){
        //多个移动到
        let file_auth0 =this.file_list.filter(item=>item.authority==0)
        if(file_auth0.length > 0){
            Dialog.message('您没有当前文件(夹)的操作权限,请重新选择!','error',3000)
        }else{
            if(this.r_fileTarId.length > 0){
                this.isRemoveWjjdialog=true;
                this.all_fileTarId=null;
                this.all_yuandata=[]
                this.ajaxRootDirectory()
            }else{
                Dialog.message('请选择移动的文件/文件夹!','error',1500)
            }
        }
    },
    handleRomoveWj({fileTarId,type}={}){
        //单个移动到
        this.r_fileArr=[];
        const ids = [],that=this;
        ids.push(fileTarId)
        this.r_fileTarId = ids;
        this.r_fileArr.push({
            'fileTarId':fileTarId,
            'type':type
        })
        if(this.r_fileTarId.length > 0){
            this.isRemoveWjjdialog=true
            this.all_fileTarId=null;
            this.all_yuandata=[]
            this.ajaxRootDirectory()
        }
    },
    handleromoveWjjClose(){
        this.isRemoveWjjdialog=false;
        if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    handleRemoveNodeClick(data) {
        this.all_fileTarId = data.fileTarId;
        this.r_toFileTarId = data.fileTarId;
        if(!data.children){
            this.ajaxAallDirectories()
        }
    },
    handleRomoveWjComfrim(){
        let that = this;
        let param={
            'empAccId':that.empAccId,
            'fileTarIds':that.r_fileTarId,
            'toFileTarId':that.r_toFileTarId,
        }
        if(this.r_toFileTarId != ''){
            this.r_loading=true;
            getData("web/file/remove", param).then(res => {
                if (res.code == 200) {
                    Dialog.message('移动文件成功!','success',1500)
                    that.now_page=1;
                    that.inittable();
                    that.isRemoveWjjdialog=false;
                }else{
                    Dialog.message(res.message,'error',1500)
                }
                setTimeout(() => {
                    that.r_loading = false;
                }, 3000);
            });
        }else{
            Dialog.message('请选择文件/文件夹!','error',1500)
        }
    },
    //删除列表里文件/文件夹
    //删除批量
    handleDeleteWjHead(){
        if(this.fileUp_authority == 1){
            if(this.d_fileTarId.length > 0){
                let param={
                    'corpAccId':this.corpAccId,
                    'empAccId':this.empAccId,
                    'fileTarIds':this.d_fileTarId
                }
                this.ajaxWjDelete(param)
            }else{
                Dialog.message('请选择要删除的文件/文件夹!','error',1500)
            }
        }else{
            Dialog.message('您没有当前文件夹的操作权限!','error',1500)
        }
    },
    ///删除单个
    handleDeleteWj(fileTarId){
        const ids = [];
        ids.push(fileTarId)
        this.d_fileTarId = ids;
        let that = this;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarIds':this.d_fileTarId
        }
        this.ajaxWjDelete(param)
    },
    ajaxWjDelete(data){
        let that = this;
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            getData("web/file/batchLogicDelete", data).then(res => {
                if (res.code == 200) {
                    Dialog.message('删除成功!','success',1500)
                    that.now_page=1;
                    let param={
                        'corpAccId':that.corpAccId,
                        'empAccId':that.empAccId,
                        'fileTarId':that.fileTarId,
                        'page':that.now_page,
                        'size':that.page_size
                    }
                    that.ajaxtable(param)
                } else {
                    Dialog.message(res.message,'error',1500)
                }
            });
        })
    },
    //复制文件
    //关闭
    handlecopyWjjClose(){
        this.iscopyWjjdialog=false;
       if(this.isShowtable){
            this.$refs.multipleTable.clearSelection()
        }
    },
    //单个复制
    handleCopyWj(item){
        if(item.type != 0){
            this.all_fileTarId=null;
            this.all_yuandata=[]
            this.ajaxRootDirectory()
            this.copy_fileTarId = item.fileTarId;
            this.copy_parentFileId = item.parentFileId;
            this.iscopyWjjdialog=true;
        }else{
            Dialog.message('不能复制文件夹，请选择文件!','error',3000)
        }
    },
    handlecopyNodeClick(data){
        this.copy_toFileTarId = data.fileTarId;
        this.fileTarId = data.fileTarId;
        this.copy_data = data;
        this.all_fileTarId = data.fileTarId;
        if(!data.children){
            this.ajaxAallDirectories()
        }
    },
    handleCopyWjComfrim(){
        let that = this;
        let param={
            'empAccId':that.empAccId,
            'fileTarId':that.copy_fileTarId,
            'toFileTarId':that.copy_toFileTarId,
        }
        if(this.copy_toFileTarId != ''){
            this.copy_loading=true;
            getData("web/file/copy", param).then(res => {
                if (res.code == 200) {
                    Dialog.message('复制文件成功!','success',1500)
                    if(that.copy_parentFileId != that.copy_data.fileTarId){
                        that.breadcrumbtitList = []
                        let s_visitUrl = that.copy_data.visitUrl
                        let arr_visitUrl = s_visitUrl.split('/')
                        let arr_idPath = that.copy_data.idPath.split('/')

                        let arr_url_split = arr_visitUrl.slice(2)
                        let arr_idPath_split = arr_idPath.slice(3)
                        // console.log(arr_url_split)
                        // console.log(arr_idPath_split)

                        let newbrod = [];
                        if(arr_url_split.length>0){
                            arr_url_split.map((v,i) => {
                                if(v){
                                    let item = {
                                        'fileName':v,
                                        'fileTarId':arr_idPath_split[i]
                                    }
                                    newbrod.push(item)
                                }
                            })
                        }
                        that.breadcrumbtitList = newbrod
                    }
                    that.now_page = 1;
                    that.inittable();
                    that.iscopyWjjdialog=false;
                }
                setTimeout(() => {
                    that.copy_loading = false;
                }, 3000);
            });
        }else{
            Dialog.message('请选择文件/文件夹!','error',1500)
        }
    },
    //搜索
    //触发搜索
    spikSearchkey(){
        this.now_page=1;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileName':this.keywords,
            'page':this.now_page,
            'size':this.page_size
        }
        this.ajaxtable(param)
        this.isSearch = true;
        this.breadcrumbtitList = []
    },
    //搜索列表每个文件(夹)路径的跳转
    handleLinkPath(row){
        this.now_page=1;
        this.fileUp_authority = row.authority;
        //type为文件夹时取文件夹id,文件时取文件父id
        this.fileTarId = row.type == 0 ? row.fileTarId : row.parentFileId

        let s_visitUrl = row.visitUrl
        let arr_visitUrl = s_visitUrl.split('全部文件/')
        let arr_idPath = row.idPath.split('/'+this.parentFileId+'/')

        let arr_url_split = arr_visitUrl[arr_visitUrl.length-1].split('/');
        let arr_idPath_split = arr_idPath[arr_idPath.length-1].split('/');
        // console.log(arr_url_split)
        // console.log(arr_idPath_split)

        let newbrod = [],that=this;
        if(arr_url_split.length>0){
            arr_url_split.map((v,i) => {
                if(v){
                    let item = {
                        'fileName':v,
                        'fileTarId':arr_idPath_split[i]
                    }
                    newbrod.push(item)
                }
            })
        }

        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':this.fileTarId,
            'page':this.now_page,
            'size':this.page_size
        }
         //type为文件时删除面包屑数组最后一个元素，以便只展示到父文件夹
        if( row.type != 0){
            let popped_newbrod = newbrod.pop();
        }
        this.ajaxtable(param)
        this.isSearch = false;
        this.breadcrumbtitList = this.breadcrumbtitList.concat(newbrod)
        // console.log(JSON.stringify(this.breadcrumbtitList,null,'\t'))
    },
    //表格
    handleCheckChange(evArr) {
        this.file_list=evArr
        this.r_fileArr=[]
        let file_auth0 = evArr.filter(item=>item.authority==0)
        if(file_auth0.length > 0){
            this.isAuth=false
        }else{
            this.isAuth=true
        }
        evArr.forEach((v,i)=>{
            if(v.authority==0){
                Dialog.message('您对'+v.fileName+'文件（夹）只有下载操作,需其他操作请重新选择!','error',3000)
            }
        })
        //多选
        const ids = [],that=this;
        evArr.map((item)=>{
            ids.push(item.fileTarId)
            that.r_fileArr.push({
                'fileTarId':item.fileTarId,
                'type':item.type
            })
        })
        this.r_fileTarId = ids;
        this.d_fileTarId = ids;
        this.root_fileTarIds = ids;
        this.download_fileTarIds = ids;
    },
    //表格初始化
    sizeFormatFormatter(row, column) {
        return row.sizeFormat ? row.sizeFormat : '-';
    },
    descriptionFormatter(row, column) {
        return row.description ? row.description : '-';
    },
    modifierFormatter(row, column){
        return row.modifier ? row.modifier : '-';
    },
    //单击文件(夹)
    dblclickFileRow(row){
        let that = this, arr=[];
        //文件夹
        if(row.type == 0){
            this.fileTarId = row.fileTarId;
            this.fileUp_authority = row.authority;
            this.breadcrumbtitList.push(row)
            this.breadcrumbtitList = unique(this.breadcrumbtitList)
            this.now_page=1;
            let param = {
                'corpAccId':this.corpAccId,
                'empAccId':this.empAccId,
                'fileTarId':this.fileTarId,
                'type':row.type,
                'page':this.now_page,
                'size':this.page_size
                // 'fileName':row.fileName
            }
            this.ajaxtable(param)
        }
        //图片
        if(row.type == 2){
            this.viewer_imgs = [axios.defaults.baseURL+'upload'+encodeURI(row.localUrl)]
            console.log(axios.defaults.baseURL+'upload'+encodeURI(row.localUrl))
            this.$viewerFuj.show();
        }
        //文档
        if(row.type == 1){
            this.isloadlist=true
            this.loadlistTxt='拼命加载打开文件，请稍等'
            this.docPreview(row)
        }
    },
    //赋值图片预览
    initedFj(viewer) {
      this.$viewerFuj = viewer;
    },
    //文档预览
    docPreview(row){
        getData("web/file/preview", {
            'fileTarId':row.fileTarId
        }).then(res => {
            if (res.code == 200) {
                if(res.data){
                    // var url = encodeURI(axios.defaults.baseURL+res.data)
                    var url = axios.defaults.baseURL+res.data
                    //window.open(url,'_blank',"menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
                    //使用window.open方法打开的窗口可能被拦截的替代方案，可利用超链接打开的url是不会被浏览器拦截
                    var el = document.createElement("a");
                    document.body.appendChild(el);
                    el.href = encodeURI(url);
                    el.target = '_blank';
                    el.click();
                }
            }else{
                Dialog.message(res.message,'error',1500)
            }
            setTimeout(() => {
                this.isloadlist=false
                this.loadlistTxt=''
            }, 2000);
        });
    },
    //某个单元格被点击
    cellClickFile(row){
    },
    //排序
    handleSortCommand(command){
        if(command){
            this.order_by = command;
            this.sort_type = this.sort_type == 'asc'?'desc': 'asc';
            this.now_page=1;
            let param={
                'corpAccId':this.corpAccId,
                'fileTarId':this.fileTarId,
                'empAccId':this.empAccId,
                'orderBy': this.order_by,
                'orderType':this.sort_type,
                'page':this.now_page,
                'size':this.page_size
            }
            this.ajaxtable(param);
        }
    },
    changeTableSort(column){
        let fieldName;
        switch (column.prop) {
            case "fileName":
                fieldName = 'file_name';
                break;
            case "sizeFormat":
                fieldName = 'size';
                break;
            case "lastModifiedDate":
                fieldName = 'last_modified_date';
                break;
        }
        //获取字段名称和排序类型
        let sortingType = column.order == 'descending' ? 'desc': 'asc';
        let orderBy = fieldName;
        this.now_page=1;
        let param={
            'corpAccId':this.corpAccId,
            'empAccId':this.empAccId,
            'fileTarId':this.fileTarId,
            'fileName':this.keywords,
            'orderBy': fieldName,
            'orderType':sortingType,
            'page':this.now_page,
            'size':this.page_size
        }
        this.ajaxtable(param);
    },
    //缩略图
    spikChangeTable() {
      this.isShowtable = !this.isShowtable;
      this.inittable();
    },
    //全选
    handlethumbCheckAll(val) {
        const ids = [],that=this;
        if(this.thumb_checkAll){
            this.tableData.map(function(v,i){
                if(v.authority==0){
                    Dialog.message('您对'+v.fileName+'文件（夹）只有下载操作,需其他操作请重新选择!','error',3000)
                }
                if(v.isChecked == false){
                    v.isChecked = true
                }
                ids.push(v.fileTarId)
                that.radio_arrIds.push(v)
                return v;
            })
            let file_auth0 = this.tableData.filter(item=>item.authority==0)
            if(file_auth0.length > 0){
                this.isAuth=false
            }else{
                this.isAuth=true
            }
            this.r_fileTarId = ids;
            this.d_fileTarId = ids;
            this.root_fileTarIds = ids;
            this.download_fileTarIds =ids;
        }else {
            this.tableData.map(function(v,i){
                if(v.isChecked == true){
                    v.isChecked = false;
                }
                return v;
            })
            this.r_fileTarId = [];
            this.d_fileTarId = [];
            this.root_fileTarIds = [];
            this.radio_arrIds = [];
            this.download_fileTarIds = []
        }
    },
    //单选
    spikthumbRadio(item,index) {
        let that = this;
        const ids = [];
        this.r_fileArr=[]
        this.tableData[index].isChecked = !this.tableData[index].isChecked;
        if(this.tableData[index].isChecked){
            this.radio_arrIds.push(this.tableData[index]);
        }else{
            this.radio_arrIds.map(function(v,i){
                if(v.fileTarId == that.tableData[index].fileTarId){
                    if(i>-1){
                        that.radio_arrIds.splice(i,1)
                    }
                }
            });
        }
        let file_auth0 = this.radio_arrIds.filter(item=>item.authority==0)
        if(file_auth0.length > 0){
            this.isAuth=false
        }else{
            this.isAuth=true
        }
        // this.radio_arrIds.forEach((v,i)=>{
        //     if(v.authority==0){
        //         Dialog.message('您对'+v.fileName+'文件（夹）只有下载操作,需其他操作请重新选择!','error',3000)
        //     }
        // })
        this.radio_arrIds.map((item)=>{
            if(item.authority==0){
                Dialog.message('您对'+item.fileName+'文件（夹）只有下载操作,需其他操作请重新选择!','error',3000)
            }
            ids.push(item.fileTarId)
            that.r_fileArr.push({
                'fileTarId':item.fileTarId,
                'type':item.type
            })
        })
        this.r_fileTarId = ids;
        this.d_fileTarId = ids;
        this.root_fileTarIds = ids;
        this.download_fileTarIds = ids;
        this.thumb_checkAll = false;
        // console.log(ids)
    },
    spikEnterlist(index) {
      this.currthumbindex = index;
    },
    spikLeavelist() {
        if(this.currtdropdown == 0){
            this.currthumbindex = null;
        }
    },
    spikthumbDropdown() {
      this.currtdropdown = this.currtdropdown == 1 ? 0 : 1;
    },
    //对文件权限的控制，有权限可选择
    // handleFileroot (row, index){
    //     if(row.authority == 1){
    //         return true
    //     }else{
    //         return false
    //     }
    // },
  }
};
</script>
<style lang="scss" scoped>
.all_file_container {
  position: relative;
}
.all_file_h {
  min-height: 32px;
  padding-left: 15px;
  padding-right: 28px;
}
/* .all_file_h .file_h_left{

} */
.all_file_h .file_h_right {
  padding-top: 15px;
  height: 32px;
}
.all_file_h .file_h_item {
  display: block;
  float: left;
  margin-right: 8px;
  margin-top: 15px;
}
.all_file_h .el-button--small {
  font-size: 14px;
  border-radius: 4px;
  padding: 7px 14px;
}
.all_file_h .el-button--small img {
  vertical-align: bottom;
  margin-right: 2px;
  width: 16px;
  height: 16px;
}
.all_file_h .file_h_right {
  text-align: right;
}
.all_file_h .input-search {
  width: 19vw;
  margin-right: 12px;
}

.all_file_h .file_h_r_icon {
  display: inline-block;
  vertical-align: middle;
  width: auto;
  height: auto;
  margin-left: 6px;
  cursor: pointer;
}
.all_file_h .file_h_r_icon:hover{
    opacity: 0.7;
}
.file-h-p0 {
  width: 100%;
  display: block;
  color: #222;
  font-size: 14px;
  margin-top: 20px;
  line-height: 22px;
}

.file-h-p1 {
  width: 100%;
  display: block;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
}
.dropdown_active{
    background-color: #e9faf2;
    color: #4dd89a;
}
.dropdown_active_icon{
    background-color: #F5FCF9;
    color: #18B270 !important;
}
.dropdown_active_icon::before{
    content: '';
    width: 12px;
    height: 12px;
    background: url('../assets/icon_gou.png') no-repeat center center;
    background-size: 100%;
    display: block;
    position: absolute;
    top: 10px;
    left: 6px;
}
/* body */
.file_body {
  position: relative;
  margin-bottom: 4px;
}
.file_body .el-table th {
  padding: 8px 0;
}

.file_body .el-table td {
  padding: 8px 0;
}
.file_body .all_checkbox {
  padding-left: 15px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 4px;
}
.el-dropdown-menu__item.dropdown_head{
    color: #333;
    padding-left: 24px;
    padding-right: 32px;
    line-height: 32px;
    position: relative;
}
.el-dropdown-menu__item>img.icon_gou{
    position: absolute;
    width: 14px;
    left: 6px;
    top: 10px;
}
.el-dropdown-menu__item:hover{
    background: #F5FCF9;
    color: #18B270
}
/* table列表 */
.file_body .table_cz_icon {
    width: auto;
    height: auto;
    display: block;
    float: left;
    cursor: pointer;
    margin-right: 16px;
}
.file_body .table_cz_icon img {
    vertical-align: middle;
}

.filename_icon{
    width: 20px;
    height: 20px;
    display: block;
}
.table_fileroot{
    width: 14px;
    height: 14px;
    display: block;
    margin-top: 7px;
    margin-left: 8px;
    display: none;
}
.filename_td:hover .table_fileroot{
    display: block
}
.display{
    display: block
}
.wj_path_div{
    font-size: 12px;
    color: #4489ED;
    cursor: pointer;
    width: 80vw;
    height: 24px;
    position: absolute;
    z-index: 1;
}
.wj_path_div span{
    
}
.el-table{
    color: #222;
}
.table_filename{
    margin-left: 10px;
    color:#222;
    font-size:14px;
    cursor: pointer;
}
.table_filename:hover{
    color: #18b270;
}
/* 缩略图 */
.thumbnail_list {
  position: relative;
}
.thumbnail_list_nodata{
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color: #909399;
    border-bottom: 1px solid #dcdfe6;
}
.thumbnail_list .thumbnail_item {
  width: 124px;
  height: 96px;
  cursor: pointer;
  margin-left: 8px;
  margin-top: 7px;
  padding-top: 16px;
  padding-bottom: 16px;
  float: left;
  border: 1px solid #fff;
  position: relative;
}
.thumbnail_list .thumbnail_item:hover{
  background: #f5f7fa;
//   border: 1px solid #dcdfe6;
  border-radius: 10px;
}
.thumbnail_item_active {
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
}
/* .thumbnail_list .thumbnail_item:hover{
     background: #F5F7FA;
     border: 1px solid #DCDFE6;
     border-radius:10px;
 } */
.thumbnail_item .thumbnail_item_info {
  height: 100%;
  width: 100%;
}
.thumbnail_list .thumbnail_item_text {
  width: 100%;
  text-align: center;
  display: block;
  height: 16px;
  color: #222;
}
.thumbnail_list .thumbnail_item_text:hover{
    color: #18B270;
}
.thumbnail_list .thumbnail_item_top {
  position: absolute;
  width: 100%;
  top: 5px;
  left: 5px;
}
.thumbnail_list .thumbnail_item_top img {
  vertical-align: middle;
}
.thumbnail_list .radio_img {
  opacity: 0.5;
}
.thumbnail_list .radio_img.opcity {
  opacity: 1;
}
.thumbnail_list .radio_more {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.thumbnail_list .radio_more img {
  width: auto;
  vertical-align: middle;
}

/* 缩略图下拉 */
.more_dropdown {
  width: 84px;
  border: 1px solid #18b270;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  right: -90px;
  z-index: 1;
  background: #fff;
  display: block;
  animation: mymove 5s infinite;
  -webkit-animation: mymove 5s infinite;
}
.more_dropdown::after {
  box-sizing: content-box;
  width: 0px;
  height: 0px;
  position: absolute;
  top: 4px;
  left: -16px;
  padding: 0;
  border-right: 8px solid #18b270;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  display: block;
  content: "";
  z-index: 10;
}
.more_dropdown:before {
  box-sizing: content-box;
  width: 0px;
  height: 0px;
  position: absolute;
  top: 5px;
  left: -14px;
  padding: 0;
  border-right: 7px solid #ffffff;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid transparent;
  display: block;
  content: "";
  z-index: 12;
}
.more_dropdown .m_d_item {
  height: 32px;
  width: auto;
  padding-left: 10px;
  padding-right: 4px;
  line-height: 32px;
}
.more_dropdown .m_d_item:hover {
  background: #f5fcf9;
}

/* 分享链接弹框 */
.share_dialog_box{

}
.share_dialog_box .share_lable{
    width: 100%;
    font-size: 14px;
    color: #222;
    padding-left: 10px;
}
.share_dialog_box .share_input_box{
    margin-top: 3px;
    margin-left: 10px;
}
.share_dialog_box .share_item{
    margin-bottom: 12px;
}
.share_dialog_box .share_input_box .share_shix_btn{
    width: 80px;
    height: 32px;
    line-height: 34px;
    border:1px solid #DCDFE6;
    border-radius: 4px;
    padding-left: 6px;
    cursor: pointer;
    margin-right: 10px;
}
.share_dialog_box .share_input_box .share_shix_btn_active{
    border:1px solid #51C493;
    background-color: #F5FCF9;
    background-image: url('../assets/icon_gou.png');
    background-repeat: no-repeat;
    background-position: 96% 50%;
    background-size: 14px;
}
</style>