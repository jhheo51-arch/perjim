import {diagnoseAccount,subject} from '../src/diagnosis.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';import {accountURL,parseFeed,parseTrends,recommend} from '../src/strategy.mjs';
test('지원 주소 정규화와 추적 문자열 제거',()=>{assert.equal(accountURL('https://www.instagram.com/colorful_picture_life/?utm_source=qr').url,'https://www.instagram.com/colorful_picture_life/');assert.equal(accountURL('https://blog.naver.com/tedd51').feed,'https://rss.blog.naver.com/tedd51.xml');});
test('내부 주소와 임의 도메인, 게시물 주소 거절',()=>{for(const u of ['http://127.0.0.1','https://localhost/','https://www.instagram.com/p/abc/','https://user:password@instagram.com/test'])assert.throws(()=>accountURL(u));});
test('RSS 실제 제목, 링크, 날짜 해석',()=>{const x=parseFeed('<item><title><![CDATA[일상의 색]]></title><link>https://blog.naver.com/a/1</link><pubDate>Wed</pubDate><description>&lt;p&gt;직접 찍은 사진&lt;/p&gt;</description></item>');assert.equal(x[0].title,'일상의 색');assert.equal(x[0].description,'직접 찍은 사진');});
test('오래된 트렌드를 최근 신호로 채우지 않음',()=>{const xml='<item><title>현재</title><pubDate>2026-10-07T00:00:00Z</pubDate><ht:approx_traffic>100+</ht:approx_traffic></item><item><title>과거</title><pubDate>2024-10-07T00:00:00Z</pubDate></item>';assert.equal(parseTrends(xml,new Date('2026-10-07T02:00:00Z')).length,1);});
test('계정 자료가 없을 때 실제 콘텐츠를 평가했다고 주장하지 않음',()=>{const a={platform:'Instagram',posts:[],description:''};assert.ok(recommend(a,'사진 색감','공유')[1].why.includes('읽지 못해'));});
test('블로그와 Instagram에 다른 형식 제안',()=>assert.notEqual(recommend({platform:'Instagram'},'여행','공유')[1].title,recommend({platform:'네이버 블로그'},'여행','공유')[1].title));

test('여러 SNS 등록은 지원하되 정보 읽기와 구분한다',()=>{assert.equal(accountURL('https://www.youtube.com/@demo').platform,'YouTube');assert.equal(accountURL('https://www.tiktok.com/@demo').platform,'TikTok');assert.equal(accountURL('https://example.com/profile').platform,'기타 SNS');});
test('페이지 통계를 브랜드 소개라고 판정하지 않는다',()=>assert.equal(diagnoseAccount({description:'828 Followers, 837 Following',posts:[]})[0].level,'확인하지 못함'));
test('직접 소개 없이 확인된 주제 후보를 사용한다',()=>assert.equal(subject({title:'여행 숙소',posts:[]}).text,'여행과 장소'));
