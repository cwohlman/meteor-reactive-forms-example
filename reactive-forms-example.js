Items = new Meteor.Collection('items');

if (Meteor.isClient) {
  Template.hello.helpers({
    item: function () {
      return Items.findOne();
    }
    , schema: {
      nickname: {
        maxLength: 5
      }
      , fullname: {
        required: true
      }
      , friends: {
        child: {
          name: {
            required: true
          }
          , age: {
            number: true
          }
        }
      }
    }
    , message: function () {
      Template.hello.instance = this;
      return "Because the forms library is a wrapper, all of your template helpers are available inside of your form. For example, this text was generated by a helper.";
    }
    , errorClass: function (name) {
      return this.get('errors', name) ? 'has-error' : '';
    }
    , onSubmit: function () {
      return function (values, original) {
        if (original) {
          Items.update(original._id, {
            $set: values
          });
        } else {
          Items.insert(values);
        }
      };
    }
    , bannerClass: function () {
      return Session.get('updated') ? '' : 'hidden';
    }
    , autoFormSchema: {
      name: {
        type: 'text'
        , label: 'Name'
        , required: true
      }
      , age: {
        type: 'number'
        , label: 'Age'
        , required: true
        , number: {
          larger: 18
        }
      }
      , nickname: {
        label: 'Nickname'
      }
      , fullname: {
        label: 'Fullname'
        , helpText: "Your name as it appears on your drivers license"
      }
      , favorite: {
        label: 'Favorite Color'
        , type: 'selectize'
        , autocomplete: [
          'Red'
          , 'Green'
          , 'Blue'
          , 'Orange'
          , 'Black'
          , 'Yellow'
        ]
      }
      , paint: {
        label: 'Paint Color'
        , type: 'selectize'
        , options: [
          'Red'
          , 'Green'
          , 'Blue'
          , 'Orange'
          , 'Black'
          , 'Yellow'
        ]
      }
      , picture: {
        label: 'Picture'
        , type: 'file'
      }
      , showPicture: {
        label: 'Show Picture'
        , type: 'checkbox'
        , checkboxLabel: 'Show your picture on your profile page?'
      }
    }
  });

  Template.hello.events({
    'click .btn-reset-names': function () {
      this.set('nickname', null);
      this.set('fullname', null);
    }
    , 'click .btn-empty-names': function () {
      this.set('nickname', '');
      this.set('fullname', '');
    }
    , 'click .btn-delete': function () {
      if (this.item) Items.remove(this.item._id);
    }
    , 'click .btn-add-friend': function (e, tmpl) {
      var friends = this.get('friends');
      friends = friends || [];
      friends.push({
        _id: Random.id()
        , name: this.get('newFriend')
      });
      this.set('friends', friends);
      this.set('newFriend', '');
      tmpl.find('[name="newFriend"]').focus();
    }
    , 'keydown [name="newFriend"]': function (e, tmpl) {
      // enter key
      if (e.which == 13) {
        e.preventDefault();
        e.currentTarget.blur();
        // e.stopPropagation();
        // allow blur event to be handled by forms.onChange
        Meteor.setTimeout(function () {
          tmpl.find('.btn-add-friend').click();
        }, 0);
      }
    }
  });

  Meteor.autorun(function () {
    var x = Items.findOne();
    if (x) {
      $('.alert').show();
    }
    Meteor.setTimeout(function () {
      $('.alert').fadeOut();
    }, 1500);
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
