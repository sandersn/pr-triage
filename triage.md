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

This PR is quite old now. I'm going to close it for now and we can re-open it if needed.

### Review failed

- Unfortunately, we never got to reviewing this, even though its bug would be nice to fix.

- Looking back at this PR, I feel like it makes too large and risky a change for the benefit of fixing its bug.

I think it's best to close this since it is now quite old.

### Maybe, minor fix
@weswigham This has been open for a couple of years. If this isn't the right solution, should we close it? 
Is it possible to fix the error that @Andarist mentions some other way?

Either way, this fix is probably minor enough to wait until Corsa has overtaken Strada.

### Maybe, new feature
I'm going to close this PR for a few reasons:

- It's a prototype intended to explore a design.
- We don't have time to add/review new features until we switch to Corsa, at which point this will have to be rewritten in Go.
- The PR is extremely out of date now.

- The originating issue isn't accepted. We need to decide whether a flag is even needed.

#### Maybe, minor team fix
@DanielRosenwasser do you think this is likely to apply to Corsa as well? Do you remember if it was worthwhile at the time that you opened it?

If neither are true, I'd like to close this PR.


@rbuckton is this draft worth keeping? It is pretty old now.

@weswigham did the results indicate that this is worth pursuing? It is worth keeping open?

## classify-pr Results
o4-mini to start

- 30979 + needs design
  - This PR is primarily driving language‐design discussion (syntax, precedence, recursive forms) rather than small, self‑contained fixes. It hasn’t seen significant movement since 2021 and would benefit from a fresh design review to nail down syntax and semantics before implementation can proceed.
- 49004 + quagmire
- 50372 ~ we didn't review it -> good?
- 51386 ~ quagmire/we didn't review it (mostly right, although not technically jsdoc parsing, it's still quagmirey)
- 52355 ~ we didn't review it/needs design -> too breaky
- 52990 + we didn't review it

### needs design
This is quite old now. I think the correct next step is to agree on a design, so I'm going to close this PR for housekeeping purposes.
However, since this has been open for 6 years with no discussion for 4, that indicates that we may not need or want it anyway.

Unfortunately, we haven't had time to review this PR and there's no issue showing an intent to add it to Typescript. I think it makes most sense to close this PR and re-open it if something changes.

Unfortunately, we haven't had time to work on the design of one-sided predicates and this PR is quite old now. I think it makes most sense to close this PR and re-open it if something changes.

#### quagmire
Unfortunately, I didn't have time to review this, so I'm going to close the PR even though it's likely a correct fix. Excess property detection is extremely fragile; we've revisited the rules multiple times over the years. That means that the cost of almost any fix -- reviewing, testing, fixing regressions months later -- outweighs the benefit of the fix.

#### too complex
Unfortunately, I didn't have time to review this, so I'm going to close the PR even though it's likely a correct fix. Excess property detection is extremely fragile; we've revisited the rules multiple times over the years. That means that the cost of almost any fix -- reviewing, testing, fixing regressions months later -- outweighs the benefit of the fix.

#### keep
This has been sitting for a couple of years. @Tobias-Scholz unless you want to start working on it again, I'd like to close it for housekeeping.

#### we didn't review it
This experiment is a couple of years old and didn't make a performance difference, so I'm going to close it.

## For Uncommitted Bug

Not updated in the last year. Close "no" with a message "we don't have the ability to review this for Strada. Please port to typescript-go so we can review there.". Close "later" with "this feature should wait until the Corsa port is done. Please port to typescript-go so we can review there."

### Close

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

### No
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
yin : Bugfix/union excess property check
Andarist : Prevent readonly symbols widening
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

## easy-pr Results

#### 4o-mini
47 out of 475. 11/27/9 = 23% / 57% / 19%

So that's precision. To find recall: dump a list of "yes" PRs, then look at all my comments from March 26th onward and see which PRs match
That won't be everything but it'll be close-ish.
22 / 22 = 100%
#### bad
11

48228 has no chance to survive, but the decision and reasons are both completely wrong.
58712 has the *author* asking whether there is any interest. Nobody suggests closure.
58729 I had reviewed but nobody suggested closure.
48172 I *approved* it and the author (and Jake) did some additional work on it. I guess merging is kind of closure.
#### good
27

52034 didn't literally follow the predicate but was in the right category
#### almost
9

56666 has comments by *Jake* that are sceptical but don't recommend closure.
49218 has been sitting with requested changes for a long time.
26349 is a perfect candidate *except* that had never commented on it before.
49886 has a comment from Daniel that says it's not going to happen (but doesn't request closure).
54759 has Gabriela commenting that the PR is stalled.
39699 Extremely stale, and I asked for clarifications twice with no real answer.
48838 Author (Andarist) concludes that this needed to start over, but I *never* commented on it.
53346 I asked to close it and Jake started working on it again (last year)
56072 I asked to close it and Jake indirectly said, no, it's still worthwhile.

### o3-mini

- 25 out of 475. 1/23/1  = 4% / 92% / 4%
95% recall by the same metric; probably would have been 100% except for the 17/475 queries that failed to return JSON 5 times in a row.

#### bad
1
#### good
23
#### almost
1

53739 I commented asking whether it is *ready*, not whether to *close*

### o4-mini


- 27 out of 475. 1/25/1  = 4% / 92% / 4%
95% recall by the same metric; probably would have been 100% except for the 17/475 queries that failed to return JSON 5 times in a row.
4 errors

#### bad
1
#### good
25
#### almost
1

52346 - o4's reasons make a good case that this should be 'good' tbh

### o1
Recall 19/22 = 86%
32 errors

21 results

#### bad
0
#### good
21
#### almost
