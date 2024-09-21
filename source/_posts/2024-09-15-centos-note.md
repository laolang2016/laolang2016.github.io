---
title: centos 笔记
date: 2024-09-15 23:49:06
categories:
- 996.icu
- linux
- centos
tags:
- 996.icu
- linux
- centos
---


# 镜像下载

[https://mirrors.aliyun.com/centos-vault/7.4.1708/isos/x86_64/](https://mirrors.aliyun.com/centos-vault/7.4.1708/isos/x86_64/)

[https://mirrors.aliyun.com/centos-vault/7.4.1708/isos/x86_64/CentOS-7-x86_64-DVD-1708.iso](https://mirrors.aliyun.com/centos-vault/7.4.1708/isos/x86_64/CentOS-7-x86_64-DVD-1708.iso)

# virtual box 安装

## 网卡配置

![](/images/2024-09-15-centos-note/001.png)
![](/images/2024-09-15-centos-note/002.png)

## 联网配置

安装时进入如下界面
![](/images/2024-09-15-centos-note/003.png)
打开第一个网络连接即可
![](/images/2024-09-15-centos-note/004.png)


## 静态 IP 配置

打开 `/etc/sysconfig/network-scripts/ifcfg-ens8`, 名字可能不一样, 按照上面的配置, 应该是后缀数字比较大的, 或者 `ip addr` 命令, 没有应该会看到 `enp0s3` 有 IP 地址, 打开没有 IP地址的那个进行配置就可以了, 配置如下

```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no

# 设置为 static
BOOTPROTO=static

DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp0s8
UUID=dc7e2d0f-02c1-40fe-a394-a9b6bcfd009b
DEVICE=enp0s8

# 设置为开机启动
ONBOOT=yes

# 静态 IP
IPADDR=192.168.56.103

# 网管
GATEWAY=192.168.56.1
NETMASK=255.255.255.0
DNS1=8.8.8.8
```


IP 地址确认

![](/images/2024-09-15-centos-note/005.png)

![](/images/2024-09-15-centos-note/006.png)

![](/images/2024-09-15-centos-note/007.png)

## 设置 yum 源

> 记得备份

```
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache
yum update
```

# docker

## 安装 docker

**卸载旧版本**

```
yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-engine
```


**安装依赖包**
```
yum install -y yum-utils
```

**配置镜像仓库**
```
yum-config-manager \
--add-repo \
https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

**更新 yum 索引**
```
yum makecache fast
```

**安装 docker**
```
# 红帽系列
yum install -y yajl
# ubuntu 系列
apt-get install yajl-tools 
```



## docker 加速镜像
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["xxx"] 切换成自己的地址
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```