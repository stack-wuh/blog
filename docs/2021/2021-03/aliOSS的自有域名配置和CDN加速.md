---
title: AliOSS 自有域名配置和 CDN 加速
labels: [运维, CDN]
summary: OSS 配合 CDN 加速三步走：DNS 配置二级域名、SSL 证书申请与部署、CDN 缓存策略设置。
keywords: [AliOSS, CDN, SSL, DNS]
---

## AliOSS 自有域名配置和 CDN 加速

> **摘要：** OSS 配合 CDN 加速三步走：DNS 配置二级域名、SSL 证书申请与部署、CDN 缓存策略设置。

---

### 1. 进入 DNS 控制台

首先进入 DNS 控制台，CDN 加速用的 CNAME 的回源，所以需要先准备一个二级域名。比如你可以准备一个 cdn.domain.com 二级域名，domain 是主域名，cdn 作为一个标记。

---

### 2. 进入 SSL 证书控制台

首先 CDN 回源用的 https，需要准备一个域名对应的 SSL 安全证书，其他的操作可以在 SSL 证书控制台完成。在证书申请成功后，直接部署至预选域名。别紧张预选域名不是填的是可选择的下拉框。

---

### 3. 标记 CDN 缓存的更新频率以及文件后缀

cdn 服务需要严格控制更新频率和缓存文件的类型，因为，按量计费是要收钱的。够不够简单、清楚。
