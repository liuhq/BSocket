# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## [0.2.0](https://github.com/qoqiyu/BSocket/compare/v0.1.1...v0.2.0) - 2022-05-31
### Added
- BSocket 类添加[一步到位](README.md#一步到位)方法：`oneStepOpen` 和 `oneStepClose`；
- 添加控制台信息提示。

### Changed
- BSocket 类的 `connect` 方法改名为 `build`；
- BilibiliWebSocket 实例方法 `Open` 和 `Close` 改成小写 `open` 和 `close`；
- BilibiliWebSocket 实例方法 `listenMsgs` 的参数 `callback` 不再为可选参数。

## [0.1.1](https://github.com/qoqiyu/BSocket/compare/v0.1.0...v0.1.1) - 2022-05-23
### Changed
- 包名 "bsocket" 重命名为 "b-socket"

## 0.1.0 - 2022-05-21
### Added
- BSocket 上线
