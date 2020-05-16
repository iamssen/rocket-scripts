# `@react-zeroconfig/packages`

- rule : fileName 등 디렉토리 룰에 의한 동작들
    - project
        - entry <- .zeroconfig.packages.yaml
        - external dependencies <- /package.json
        - package dir
        - imports map
        - computed package.json
- entry : build entry를 작성하는 과정
    - ordered entry
    - 디렉토리 룰을 모른다
    - 전체적인 project 단위의 형상은 모른다
- run : entry를 실제로 실행
    - entry 정보만을 가지고 단순 실행만 한다

- process : rule -> entry -> run