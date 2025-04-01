## Messages

### No, no speculative features
We can't review or merge speculative features. If the pipeline operator makes it to stage 3 of the standards process, please port this PR to microsoft/typescript-go.

I'm closing this PR because it is stale and the original issue hasn't been accepted. If the original issue is accepted, we can revisit the PR to see if any of the code is still usable.

Unfortunately, we haven't had time to review this PR and there's no issue showing an intent to add it to Typescript. I think it makes most sense to close this PR and re-open it if something changes.

Unfortunately, we haven't had time to work on the design of one-sided predicates and this PR is quite old now. I think it makes most sense to close this PR and re-open it if something changes.

### No, no unrequested fixes
This PR fixes a bug that's not in the backlog, and we haven't had time to review it, so I'm going to close it.

Big changes to the core lib are unlikely to be successful, mainly for compatibility and but also for performance reasons. It looks to me that both apply to this change.

### No, no outdated test branches
I believe this test branch is unused so I'm closing it. Please re-open it if I'm wrong.

### Already asked to close
Closing due to lack of activity.

### Close

## For Uncommitted Bug

Not updated in the last year. Close "no" with a message "we don't have the ability to review this for Strada. Please port to typescript-go so we can review there.". Close "later" with "this feature should wait until the Corsa port is done. Please port to typescript-go so we can review there."

Pokute : Add support for Partial Application
Pokute : Add support for Hack(#) -style Pipeline Operator
sheetalkamat : Branch to diagnose resolution and watch issues
jablko : Inline const enum in import equals declaration
DetachHead : make `Array` explicitly extend `ReadonlyArray` and use `this` type in the callbacks
robpaveza : User/robpaveza/sourcemaps v4
DanielRosenwasser : [Experiment/Work-in-Progress] Lazy Binding
DanielRosenwasser : Revert "Use NonNullable<T> in more scenarios"
ShuiRuTian : more strict generic type contraint for token factory methods
amcasey : Disable JS size limit by default
sheetalkamat : Report buildInfo size in extendedDiagnostics
orta : Explore adding the Boolean to filter to narrow out null/undefined in array#filter
DanielRosenwasser : Have fourslash guard against empty sets of changes for quick-fixes/refactorings/organize-imports.
amcasey : Corner case: FAR triggers project load, invalidating results already computed for inferred project
dorilahav : Remove reverse mapping const enums on preserveConstEnums
devanshj : Feature: Self-Type-Checking Types
graphemecluster : feat(15048): One-sided Type Predicates
zardoy : Include Default Parameter Values in Signature Help
MariaSolOs : Mark inaccessible codefix parameter types as `any`
armanio123 : TEST. Ignore this PR.
ahejlsberg : Cache last computed flow type for identifiers and 'this'
jakebailey : Export API to provide lib.d.ts listing/mapping

sandersn : JS declaration emit includes identical overrides
weswigham : Replace errorType return with Debug fail in checkExpressionWorker
Zzzen : WIP: allow circular project references
weswigham : Add union and intersection types to unions by type list id
Andarist : Prevent readonly symbols widening
yin : Bugfix/union excess property check
Andarist : Fixed a symbol display crash on expando members write locations
Ilanaya : feat: add flip operator refactoring
DanielRosenwasser : Always perform inode watching unless on Windows.
andrewbranch : [Experiment] Try to resolve JS after all external .d.ts resolutions
andrewbranch : Experiment: Produce wide index signatures from the spread of an index signature
mariusGundersen : Make "extract to constant" find and replace all similar expressions
ahejlsberg : Fast path for unions of string literals only
sheetalkamat : Experiment using caches to answer readFile, fileExists
sstchur : Expose getUnknownType
sandersn : Test generic DOM events again
rbuckton : Add --metadataDecorator option
arcanis : Yield Overrides
craigphicks : packageJsonWatch, testing package.json and impliedNodeFormat use in transformer
RasmusAndreassen : Modified optional thisArg to capture type

### Later
ahejlsberg : Support 'typeof class' types
orta : [Prototype] Exploration of 2 column type comparison in tsc
orta : Compiler CLI output format update v2
orta : Adds a error diagnostic with newlines if either source or target are longer than 30 characters on type is not assignable to type
orta : Revised output format of a diagnostics in tsc cli
Zzzen : Add flag to check jsx dashed attributes (#46229)
Kingwl : Add basic supports for template literal as jsx attribute value
weswigham : Measure the variance of outer type parameters for type aliases if present
weswigham : Follow `paths` in triple-slash types references
sheetalkamat : [Experiment] Handle package.json watch in tsc --build
craigphicks : Tuple rest sandwich prop
craigphicks : Pr issue 57087 - fix for relating (e.g. satisfies) function overloads to intersection specifications
Andarist : Improve computed base constraint for Index type on generic IndexedAccess
Andarist : Simplify `isDistributionDependent` to only check dependance within `trueType`/`falseType`
Andarist : Fixed contextual types within generic tuple mapped types
Andarist : Deprioritize inferences made from implicit never arrays
Andarist : Contextually type the right operand of logical or & nullish coalescing using non-nullable left type
Andarist : Don't defer resolution of indexed access types with reducible object types for writing accesses
Andarist : Type for-in initializer as `string`
Andarist : Fixed some variance measurements in type aliases of generic functions
Andarist : Infer `unknown` at value positions of objects inferred from `keyof T`
Andarist : Avoid inferring return and yield types from unreachable statements
Andarist : Allow more things to be evaluated in enum members with template expression initializers
Andarist : Use `...args: never` in builtin conditional type helpers
Andarist : Improve inference for a tuple target with 2 middle variadic elements and implied arity for the latter
DanielRosenwasser : Avoid freshening literal types when unnecessary.
rbuckton : `--annotateTransforms` switch to add transformer diagnostics to Source Maps
DanielRosenwasser : Try tracking deferred nodes using arrays
DanielRosenwasser : Disallow comparisons between identical unit types.
DanielRosenwasser : Don't subtype reduce elements of contextually typed arrays
andrewbranch : Fix auto-imports of redirected packages while making ExportInfoMap smaller?
zardoy : Exclude completions of binding pattern variable initializers
sheetalkamat : [WIP] Allow adding arbitrary extension files to program without d.ts files being on the disk
weswigham : Array subtypes inherit special array variance
jakebailey : Shortcut relations in getNarrowedTypeWorker when comparing literals
LongTengDao : GeneratorFunction should not be newable
jablko : 🤖 Sync option descriptions <- website
