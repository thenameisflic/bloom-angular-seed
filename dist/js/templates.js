angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("test.html","<div>\n	<ul>\n		<li>Li 1</li>\n		<li>Li 2</li>\n		<li>Li 3</li>\n		<li>Li 4</li>\n		<li>Li 5</li>\n	</ul>\n</div>");}]);