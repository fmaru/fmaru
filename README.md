![아이콘](https://raw.githubusercontent.com/fmaru/fmaru/master/build/icon.png)
# fmaru
fmaru는 마루마루의 만화를 광고 없이 편하게 볼 수 있는 오픈소스 뷰어 프로그램입니다.

## 특징
* 마루마루 사이트보다 빠릅니다.
* 광고가 전혀 없습니다.
* UI가 편리합니다.
* 오픈소스입니다. fmaru의 소스를 활용하여 다른 뷰어를 만들거나, 마루마루 미러 사이트 등등을 만들어도 좋습니다.

## 지원 플랫폼
* windows (64bit)
* osx
* web (서버는 nodejs로 짜여짐)

# 설치
[릴리즈 페이지](https://github.com/fmaru/fmaru/releases)에서 다운로드 받아, 실행해주세요.
OSX 버전은 dmg, 윈도우즈 버전은 압축파일로 배포됩니다.

# 스크린샷
![검색](https://raw.githubusercontent.com/fmaru/fmaru/master/capture/search.png)
![만화 보기](https://raw.githubusercontent.com/fmaru/fmaru/master/capture/view.png)

# 서버 기능
fmaru는 현재 윈도우즈/맥용 클라이언트만 있습니다. 하지만, 모바일에서 웹을 통해 사용할 수도 있습니다. fmaru 앱을 실행하면 54021 포트로 웹 서버가 실행됩니다.

* 로컬에서는 http://localhost:54021 로 접속이 가능합니다.
* 그 외에는 http://{아이피 주소}:54021 로 모바일 등에서 접속이 가능합니다.

# 빌드
## requirements
 * gulp-cli
 * node

## 앱 빌드 방법
    
    $ npm install -g gulp-cli
    $ npm start --save-dev
    $ npm run build_electron

# 서비스하는 방법
 fmaru는 웹사이트로 서비스 될 수 있습니다.

    $ npm install -g gulp-cli
    $ npm start --save-dev
    $ gulp build_web
    $ node server/server.js
  
위와 같이 하면, 54021 포트로 서버가 실행됩니다. 포트를 80으로 바꾸고 싶다면, 서버 실행 시 아래와 같이 환경변수를 지정 해줍니다.

    $ PORT=80 node server/server.js

## 서비스 운영 주의 사항
fmaru로 웹 서비스를 운영하는 것은 자유입니다. 광고를 붙여도 괜찮고, 영리 목적으로 운영해도 전혀 문제 없습니다. 하지만, marumaru가 DDOS 공격을 할 가능성이 있으므로 cloudflare를 붙이는 것을 추천 드립니다. 또한, fmaru는 marumaru.in에서 볼 수 있는 컨텐츠를 그대로 보여줄 뿐입니다. 만약 fmaru를 프로그램을 수정하여 불법 공유에 사용한다면, 서비스 운영 측의 책임입니다.

# 저작권 관련
fmaru는 marumaru.in에 있는 컨텐츠를 편하게 볼 수 있는 뷰어일 뿐입니다. fmaru는 데이터를 캐싱 이외의 용도로 저장하지 않으며, marumaru.in에 있는 컨텐츠를 그대로 보여줄 뿐입니다. fmaru는 어떤 컨텐츠가 marumaru.in에서 서비스되고 있는지, 그리고 해당 컨텐츠의 데이터를 알 수 없습니다. 만약 저작권 위반과 불법적인 컨텐츠가 있다면 이는 marumaru.in의 책임이며, 저작권과 관련된 사항은 marumaru.in으로 연락하십시오.


# 라이센스
 MIT 라이센스를 따릅니다. 소스를 가져다가 자유롭게 사용해주세요.
 
