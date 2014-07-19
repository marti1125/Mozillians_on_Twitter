// Twitter
User = Backbone.Model.extend({});

UserCollection = Backbone.Collection.extend({	
	model: User,	
	url: '',
	parse: function(response) {
		return response;
	}
});

UserView = Backbone.View.extend({
	initialize: function(){
		this.template = _.template( $("#UserView").html() );
	},
	render: function () {	
		this.$el.html(this.template({user: this.model.toJSON()}));
		return this;
	}
});

var userCollection = new UserCollection();	

var userView = new UserView({model: userCollection});

userCollection.bind('reset', function () {	
	$("#user-view").append(userView.render().$el);
});

userCollection.fetch({reset: true});