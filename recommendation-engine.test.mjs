import test from 'node:test';import assert from 'node:assert/strict';import {contentDecision} from './recommendation-engine.mjs';
test('자료가 없으면 대안 우위와 성과를 만들지 않는다',()=>{const x=contentDecision({posts:[]},'사진');assert.equal(x.kind,'insufficient');assert.equal(x.candidates.length,0);assert.match(x.limit,/확인하지 못함/);});
test('입력 소재가 달라지면 근거와 후보가 달라진다',()=>{const a=contentDecision({posts:[{title:'동네 산책에서 본 단풍',url:'https://example.com/a'}]},'사진');const b=contentDecision({posts:[{title:'장보기 가격과 생활비 기록',url:'https://example.com/b'}]},'소비');assert.notEqual(a.title,b.title);assert.equal(a.evidence[0].url,'https://example.com/a');assert.equal(b.candidates.length,2);});
test('중복 글과 미래 날짜를 반복 근거로 세지 않는다',()=>{const x=contentDecision({posts:[{title:'동네 산책',url:'https://example.com/a'},{title:'동네 산책',url:'https://example.com/a'},{title:'공원',date:'2099-01-01',url:'https://example.com/b'}]},'사진',new Date('2026-10-08'));assert.match(x.basis,/글 1개 중 1개/);assert.equal(x.evidence.length,1);});
test('알 수 없는 소재는 임의의 주제로 추천하지 않는다',()=>{const x=contentDecision({posts:[{title:'새로운 이야기',url:'https://example.com/a'}]},'브랜드');assert.equal(x.kind,'needs-context');assert.equal(x.candidates.length,0);});
test('안내 자료가 반복되면 조건을 정리하는 안을 우선하고 실제 효과와 구분한다',()=>{
 const r=contentDecision({posts:[{title:'전시 방문 준비물 가이드',url:'https://example.com/1'},{title:'동네 산책 방문 조건 정리',url:'https://example.com/2'}]},'장소');
 assert.equal(r.selected,'B');assert.match(r.outline,/전시 방문 준비물 가이드/);assert.match(r.limit,/성과 우위/);
});
