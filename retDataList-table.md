# retDataList 表格数据说明

基于 `retDataList` 数组生成的扁平化表格，便于导出为 CSV/Excel 或直接查看。

## 表格列说明

| 列名 | 说明 | 来源 |
|------|------|------|
| videoId | 视频 ID | retDataList[].videoId |
| videoTitle | 视频标题 | retDataList[].videoTitle |
| pubTime | 发布时间 | retDataList[].pubTime |
| views | 播放量 | retDataList[].views |
| likes | 点赞数 | retDataList[].likes |
| comments | 评论数 | retDataList[].comments |
| shares | 分享数 | retDataList[].shares |
| collects | 收藏数 | retDataList[].collects |
| thumbnails | 封面图 URL | retDataList[].thumbnails |
| viewFollowers | 播放/粉丝比 | retDataList[].viewFollowers |
| channelId | 频道 ID | retDataList[].channel.id |
| channelName | 频道名称 | retDataList[].channel.name |
| channelAvatar | 频道头像 URL | retDataList[].channel.avatar |
| channelFollowers | 频道粉丝数 | retDataList[].channel.followers |
| channelAlias | 频道别名 | retDataList[].channel.alias |
| hasEmail | 是否有邮箱 | retDataList[].channel.hasEmail |
| hasWhatsapp | 是否有 WhatsApp | retDataList[].channel.hasWhatsapp |
| isVideo | 是否视频 | retDataList[].isVideo |
| isPromote | 是否推广 | retDataList[].isPromote |
| isAd | 是否广告 | retDataList[].isAd |
| isEcVideo | 是否电商视频 | retDataList[].isEcVideo |
| relatedVideosCount | 关联视频数量 | retDataList[].relatedVideos.length |

## 示例数据（前 3 条）

| videoId | videoTitle | pubTime | views | likes | comments | shares | collects | thumbnails | viewFollowers | channelId | channelName | channelAvatar | channelFollowers | channelAlias | hasEmail | hasWhatsapp | isVideo | isPromote | isAd | isEcVideo | relatedVideosCount |
|---------|------------|---------|-------|-------|----------|--------|----------|------------|---------------|-----------|-------------|---------------|------------------|--------------|----------|-------------|---------|-----------|------|-----------|--------------------|
| 8qKheqpVKRI | Turning My Pool Into an Endless Swimming Lane — Swim Jet X Review | 2026-03-03 | 17257 | 28 | 8 |  |  | https://i.ytimg.com/vi/8qKheqpVKRI/maxresdefault.jpg | 0.1392 | UCgJCa5JyZUFkw2evyuvLbJA | Sami Luo Tech | https://res-kol.noxgroup.com/... | 124000 |  | true | false |  | true |  |  | 3 |
| iKEi2b21kPw | ❌ Swimming vs Jet Ski \| 30m vs 100m \| Who Won? | 2024-09-02 | 29219192 | 693498 | 274 |  |  | https://i.ytimg.com/vi/iKEi2b21kPw/maxresdefault.jpg | 1 | UC47GYldzidLb_N70Wp4tutg | narkevichag | https://res-kol.noxgroup.com/... | 967000 |  | true | false |  | false |  |  | 0 |
| ZNt_GoOBHq8 | Human vs Jet Engine | 2024-10-18 | 535610935 | 13402529 | 18483 |  |  | https://i.ytimg.com/vi/ZNt_GoOBHq8/maxresdefault.jpg | 1 | UCX6OQ3DkcsbYNE6H8uQQuVA | MrBeast | https://res-kol.noxgroup.com/... | 470000000 |  | true | false |  | false |  |  | 3 |

## 如何生成完整表格

1. 将完整的 API 返回 JSON 保存到项目根目录的 **test.md** 文件中（确保是合法 JSON）。
2. 在项目根目录执行：
   ```bash
   node scripts/retDataList-to-table.mjs
   ```
3. 会生成：
   - **retDataList-table.csv**：Excel 可打开的 CSV（含 BOM）
   - **retDataList-table-full.md**：完整 Markdown 表格

> **说明**：若当前 `test.md` 未保存或为空，脚本会报错 `Unexpected end of JSON input`。请先保存包含 `retDataList` 的 JSON 再运行。
