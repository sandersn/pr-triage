== Fixes ==
* https://github.com/microsoft/TypeScript/pull/28168 - don't count `require()` as making a TS file a module

  Notes:
  - This is a breaking change because `@types/node` will be included by mistake less often, which may be expected by now.

== Features ==

* https://github.com/microsoft/TypeScript/pull/34713 - simplify extension handling wrt .d.ts and .js

  Notes:
  - Ryan has also reviewed this.
  - Remember to request changes to transition this to Waiting on Author.
* https://github.com/microsoft/TypeScript/pull/29010 - add getSupportedCodeFixes to language service interface

