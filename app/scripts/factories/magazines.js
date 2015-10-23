define('magazinesFact', function() {
	return function() {
		var magazines = [
			{
				name: 'Hellblazer',
				protagonist: 'John Constantine'
			},
			{
				name: 'Sandman',
				protagonist: 'Morpheus / Dream'
			},
			{
				name: 'Preacher',
				protagonist: 'Jesse Custer'
			}
		];
		return {
			'all': function() {
				return magazines;
			}
		}
	}
});