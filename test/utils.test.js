import { stringJoin, int, innerHeight } from '../src/lib/utils';
import assert from "power-assert";

describe("utils test", () => {
  it("should join the string", () => {
    const joined = stringJoin('good', 'bye');
    assert.equal(joined, 'good bye')
  });

  it("parseint", () => {
    const inted = int("1233");
    assert.equal(inted, 1233);
  });

});