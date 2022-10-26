---
title: "Don't be afraid of reverting code in Git"
date: '2022-10-24'
icons: []
---

[Git](https://git-scm.com/) is arguably the most used version control system and part of the day to day of every engineer.

We pull code from our peers, push our code into branches, merge our pull requests (PR) into other branches, etc. but sometimes we have to revert them either because of a bug or because the functionality is no longer needed.

`git revert {COMMIT_HASH}` undoes a commit identified by its hash. We can also append multiple hashes and all of them will be reverted.

Assuming that we have three commits: X, Y and Z, it is also possible to revert all code between commits X and Z using `git revert {COMMIT_HASH_X}..{COMMIT_HASH_Z}`, which will revert Y and Z but keep X.

Note that you still have to commit your changes after revert.

## "Squash and merge" functionality

There are several different online services (GitHub, GitLab, Bitbucket, etc) we could use that support Git version control system. These often provide interesting features on top of Git, for example webhooks, actions, environments management, secrets management, and many others.

Using "Squash and merge" has often been a discussion at every company I've worked. The "Squash and merge" button allows you to join all code from the commits in the Pull Request into a single commit and merge it after into the desired branch.
Some argue it provides cleaner history, others argue that we should have all commits to also make it easy to revert if necessary. While it is out of the scope of this article to discuss its pros and cons, it'i's important to understand all details on what is possible to do.

Imagine the following scenario where we have two commits, `a` and `b`, which add two files respectively, `a.md` and `b.md`:

```bash
commit d54d04edb31ed3e7b6df3b7ba4f6d63870e2d18b (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:00 2022 +0100

    feat: adding b

commit 23ce4cf37deb9a6bd40903da66a2fcd642e0b256
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:49:52 2022 +0100

    feat: adding a
```    

```bash
 > ls
a.md b.md                                       # confirms we have the two files
 > touch c.md                                   # adds a new file, c.md
 > git add .
 > git commit -m "feat: adding c"
[main 848a76b] feat: adding c
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 c.md  
```

At this stage we have three commits, one per feature. If we run `git log` we get the following:

```bash
commit 7d2e3e91763ee403c411bb537baede36b4985484 (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:17 2022 +0100

    feat: adding c

commit d54d04edb31ed3e7b6df3b7ba4f6d63870e2d18b
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:00 2022 +0100

    feat: adding b

commit 23ce4cf37deb9a6bd40903da66a2fcd642e0b256
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:49:52 2022 +0100

    feat: adding a
```    

We can simulate the squash part of clicking on "Squash and merge" button locally using rebase. Let's say we want to squash the last two commits, we can do:

`git rebase -i HEAD~2`

This will prompt the interactive rebase (`-i` stands for interactive) where we can decide what to do with our commits. In order to squash the last commit `feat: adding c` into `feat: adding b` we need to type "squash" (or "s") in the line related to the commit we want to squash (commit with the `7d2e3e9` hash).

Turning the following:

```bash
pick d54d04e feat: adding b
pick 7d2e3e9 feat: adding c
```

Into: 

```bash
pick d54d04e feat: adding b
squash 7d2e3e9 feat: adding c
```

It will also prompt you about the commit messages, and you can just keep both of them. After leaving the interactive mode we will get the following:

```bash            
[detached HEAD e7c1492] feat: adding b
 Date: Mon Oct 24 21:51:00 2022 +0100
 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b.md
 create mode 100644 c.md
Successfully rebased and updated refs/heads/main.                                   
 > ls
a.md b.md c.md                                    # we can confirm our 3 files are here

````
However, running `git log` will show two commits within one and give us the following:

```bash
commit 1704d06c797bf2d39ce300fa2d271be6fc855357 (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:00 2022 +0100

    feat: adding b

    feat: adding c

commit 23ce4cf37deb9a6bd40903da66a2fcd642e0b256
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:49:52 2022 +0100

    feat: adding a
```

Now imagine we have a problem in commit `b` and we would like to remove it. This is still possible if we have the hash of commit `b`!

```bash                                       
 > git revert d54d04edb31ed3e7b6df3b7ba4f6d63870e2d18b 
Removing b.md
[main 1fffee4] Revert "feat: adding b"
 1 file changed, 0 insertions(+), 0 deletions(-)
 delete mode 100644 b.md                                          
 > ls                                                  
a.md c.md                                         # only 2 files, b.md was removed
```

And if we run `git log` again we will see the revert:

```bash
commit 7e21db157c62dc5340f01b66672a70cf58ddb831 (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:56:20 2022 +0100

    Revert "feat: adding b"

    This reverts commit d54d04edb31ed3e7b6df3b7ba4f6d63870e2d18b.

commit 1704d06c797bf2d39ce300fa2d271be6fc855357
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:00 2022 +0100

    feat: adding b

    feat: adding c

commit 23ce4cf37deb9a6bd40903da66a2fcd642e0b256
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:49:52 2022 +0100

    feat: adding a
```

### Tip: using fixups!

While using rebase to squash the PR it reminded me of another interesting feature that Git provides that not everyone is aware of.

Fixups allow to add changes on a commit on a pull request you've been working. It could also be useful if you're addressing a comment from one of your peers and you don't want to add a commit message such as "fix: addressing the comments in PR". It prevents needing to add a commit message.

Let's say we want to change file `c.md` and apply the fixup, we can do the following:

```bash
 > git add .
 > git log
 > git commit --fixup 1704d06c797bf2d39ce300fa2d271be6fc855357
[main 4302a8d] fixup! feat: adding b
 1 file changed, 1 insertion(+)
```

If we run `git log` we observe that a new commit has been added:

```bash
commit 4302a8d221381b27ff57bb0e6a063050c48f1260 (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 22:03:45 2022 +0100

    fixup! feat: adding b
```

Once we’re done, and have applied fixups to various commits, we can squash them into the final commit to have a cleaner history (with the fixups still incorporated). A way to do it is using autosquash:

`git rebase -i --autosquash`

It will prompt you with the following interactive mode, with the fixup commit moved near to the relevant commit to which the code will be added. In this case `4302a8d` will be added to `1704d06`.

```bash
pick 23ce4cf feat: adding a
pick 1704d06 feat: adding b
fixup 4302a8d fixup! feat: adding b
pick 7e21db1 Revert "feat: adding b"
// ...
```

That's it! After closing the interactive mode, your rebase will be applied and commits with fixups squashed. When you look at the history now, you will see the fixup commit is omitted:

```bash
commit 79ea1518795ca05dd661c664341db2bf2d85350d (HEAD -> main)
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:56:20 2022 +0100

    Revert "feat: adding b"

    This reverts commit d54d04edb31ed3e7b6df3b7ba4f6d63870e2d18b.

commit 2805c1f50b13b58bcdf9cbb477ef17290f2cef45
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:51:00 2022 +0100

    feat: adding b

    feat: adding c

commit 4d8bb1967698b5bbb7aec16782653e8a0f07048b
Author: Daniela Matos de Carvalho
Date:   Mon Oct 24 21:49:52 2022 +0100

    feat: adding a
```

An important thing to note is that the hashes of the commits change, and that's also why Git is such a powerful tool. You can still go back in time if necessary and bring back the old commits. Explore [`git reflog` command](https://git-scm.com/docs/git-reflog), as it might give you a hint!

Note: any opinions expressed here are my own and do not represent my employer.
