String.prototype.trim = String.prototype.trim || function() {
        return this.replace(/^\s+|\s+$/,"");
}

String.prototype.left = function(n) {
        return this.substr(0,n);
};

String.prototype.right = function(n) {
        return this.substr((this.length-n),this.length);
};