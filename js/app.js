angular.module('aspirantfashion', ['ui.router','firebase','ui.bootstrap'])
.directive("owlCarousel", function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
              // provide any default options you want
                var defaultOptions = {
                        navigation : true, // Show next and prev buttons
                        paginationSpeed : 400,
                        items : 1,
                        itemsDesktop : false,
                        itemsDesktopSmall : false,
                        itemsTablet: false,
                        autoplay:true,
                        infinite: false,
                        autoplayTimeout:4000,
                        goToFirst: true,
                        loop:true,
                        itemsMobile : false
                };
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                // for(var key in customOptions) {
                //     defaultOptions[key] = customOptions[key];
                // }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        }
    };
})
.directive('owlCarouselItem', [function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);
