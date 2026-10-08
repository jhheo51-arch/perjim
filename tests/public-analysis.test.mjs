import test from 'node:test';
import assert from 'node:assert/strict';
import {subject,publicEvidence,nextContent} from '../src/diagnosis.mjs';
test('읽지 못한 내용과 반응을 확인하지 못함으로 표시한다',()=>{
 const a={platform:'Instagram',id:'colorful_picture_life',title:'',description:'',posts:[]};
 assert.equal(subject(a).text,'내 브랜드');
 assert.ok(publicEvidence(a).every(x=>x.value==='확인하지 못함'));
 assert.match(nextContent(a,subject(a).text).basis,/시작용 제안/);
});
test('피드 제목으로 추천하되 실제 반응을 추정하지 않는다',()=>{
 const a={posts:[{title:'동네 산책에서 본 가을',date:'2026-10-01',description:'길을 걸으며 발견한 풍경'}]};
 assert.equal(nextContent(a,'사진과 일상').evidence[0].title,'동네 산책에서 본 가을');
 assert.equal(publicEvidence(a).at(-1).value,'확인하지 못함');
 assert.equal(publicEvidence(a)[2].value,'1개 (공개 피드 범위)');
});
test('페이지 안내와 팔로워 표시는 소개로 사용하지 않는다',()=>{
 const a={description:'120 Followers 30 Following. See Instagram',posts:[]};
 assert.equal(publicEvidence(a)[1].value,'확인하지 못함');
});
