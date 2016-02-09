angular.module('app.filters', [])

.filter('filterByCategory', function() {
    return function(input, category) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if(input[i].category.id == category.id){
                out.push(input[i]);
            }
        }
        return out;
    }
})

;