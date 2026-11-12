---
status: accepted
---

# 0013. An English task that leaves gender open accepts both genders

English "friend", "teacher" or "I am tired" does not say whether the Spanish is amigo or amiga, profesor or profesora, cansado or cansada. When the English task leaves the gender open, a typed exercise accepts both forms, and a choice does not offer the other form as a wrong option. When an exercise teaches one form, its task states the gender, for example "(male speaker)" or "My female friend". A named or he/she subject already decides an adjective's form, and so does a gendered noun such as sister. The main answer and its recording stay as they are: the other form joins `accepted`, and the feedback shows the accepted answer nearest to what the learner typed. Word-tile exercises are exempt, since the tiles fix the form. `src/data/gender.test.ts` checks every scored exercise against a list of such words, so extend that list when content uses a new one. Decided in [#817](https://github.com/PatrykPodworski/paso/issues/817).
