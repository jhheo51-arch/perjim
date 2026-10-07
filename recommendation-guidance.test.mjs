import test from 'node:test';import assert from 'node:assert/strict';
import {deliveryReview,guidanceSources} from './recommendation-guidance.mjs';
test('미확인 계정에는 구체적 실행 검증을 만들지 않는다',()=>{assert.equal(deliveryReview({kind:'insufficient'}).items.length,0);});
test('공개 글을 검증안에 연결하고 비율과 총량을 구분한다',()=>{const r=deliveryReview({kind:'observed',evidence:[{title:'동네 산책 기록'}]});assert.match(r.items[0].draft,/동네 산책 기록/);assert.match(r.items[2].action,/도달이 줄어/);assert.match(r.items[3].check,/부담/);for(const i of r.items)assert.ok(guidanceSources[i.source]);});
