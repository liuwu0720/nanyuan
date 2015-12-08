/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : wegov

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-12-03 14:20:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `base_role_menu`
-- ----------------------------
DROP TABLE IF EXISTS `base_role_menu`;
CREATE TABLE `base_role_menu` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `is_active` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0：禁用;1:有权限',
  PRIMARY KEY (`rid`),
  UNIQUE KEY `uq_role_menu` (`role_id`,`menu_id`),
  KEY `fk_menu` (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of base_role_menu
-- ----------------------------
INSERT INTO `base_role_menu` VALUES ('1', '1', '1', '1');
INSERT INTO `base_role_menu` VALUES ('2', '1', '2', '1');
INSERT INTO `base_role_menu` VALUES ('3', '1', '3', '1');
INSERT INTO `base_role_menu` VALUES ('4', '1', '4', '1');
INSERT INTO `base_role_menu` VALUES ('5', '1', '5', '1');
INSERT INTO `base_role_menu` VALUES ('6', '1', '6', '1');
INSERT INTO `base_role_menu` VALUES ('7', '1', '7', '1');
INSERT INTO `base_role_menu` VALUES ('8', '1', '8', '1');
INSERT INTO `base_role_menu` VALUES ('9', '1', '9', '1');
INSERT INTO `base_role_menu` VALUES ('10', '1', '10', '1');
INSERT INTO `base_role_menu` VALUES ('12', '1', '12', '1');
INSERT INTO `base_role_menu` VALUES ('13', '1', '13', '1');
INSERT INTO `base_role_menu` VALUES ('14', '1', '14', '1');
INSERT INTO `base_role_menu` VALUES ('19', '1', '15', '1');
INSERT INTO `base_role_menu` VALUES ('20', '1', '16', '1');
INSERT INTO `base_role_menu` VALUES ('21', '1', '17', '1');
INSERT INTO `base_role_menu` VALUES ('23', '1', '19', '1');
INSERT INTO `base_role_menu` VALUES ('24', '1', '20', '1');
INSERT INTO `base_role_menu` VALUES ('25', '1', '21', '1');
INSERT INTO `base_role_menu` VALUES ('26', '2', '4', '1');
INSERT INTO `base_role_menu` VALUES ('27', '1', '22', '1');
INSERT INTO `base_role_menu` VALUES ('28', '2', '1', '0');
INSERT INTO `base_role_menu` VALUES ('29', '2', '2', '0');
INSERT INTO `base_role_menu` VALUES ('30', '2', '3', '1');
INSERT INTO `base_role_menu` VALUES ('31', '2', '5', '1');
INSERT INTO `base_role_menu` VALUES ('32', '2', '6', '1');
INSERT INTO `base_role_menu` VALUES ('33', '2', '7', '0');
INSERT INTO `base_role_menu` VALUES ('34', '2', '8', '1');
INSERT INTO `base_role_menu` VALUES ('35', '2', '9', '1');
INSERT INTO `base_role_menu` VALUES ('39', '2', '10', '0');
INSERT INTO `base_role_menu` VALUES ('41', '2', '11', '1');
INSERT INTO `base_role_menu` VALUES ('42', '2', '12', '0');
INSERT INTO `base_role_menu` VALUES ('43', '2', '13', '0');
INSERT INTO `base_role_menu` VALUES ('44', '2', '14', '1');
INSERT INTO `base_role_menu` VALUES ('45', '2', '15', '1');
INSERT INTO `base_role_menu` VALUES ('46', '2', '16', '1');
INSERT INTO `base_role_menu` VALUES ('47', '2', '17', '1');
INSERT INTO `base_role_menu` VALUES ('48', '2', '18', '1');
INSERT INTO `base_role_menu` VALUES ('49', '2', '19', '1');
INSERT INTO `base_role_menu` VALUES ('50', '2', '20', '1');
INSERT INTO `base_role_menu` VALUES ('51', '2', '21', '1');
INSERT INTO `base_role_menu` VALUES ('52', '2', '22', '0');
