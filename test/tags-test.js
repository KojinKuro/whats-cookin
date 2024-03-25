import { expect } from 'chai';
import { filterRecipeByTag } from '../src/tags';
describe('filterRecipeByTag', function() {
    it('should find recipes by id tag', function() {
        const recipesTag = filterRecipeByTag(['lunch']);
        
        expect(recipesTag).to.be.an('array');
        expect(recipesTag).to.have.lengthOf(12);
    });
    it('should be able to find recipes with more than one id tag', function() {
        const recipesWithMultipleTags = filterRecipeByTag(['snack', 'starter']); // Pass only the tag(s) as an array
        
        expect(recipesWithMultipleTags).to.be.an('array');
        expect(recipesWithMultipleTags).to.have.lengthOf(9);       
    });
});