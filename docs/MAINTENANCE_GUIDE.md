# Guide de Maintenance - WiFi Sénégal

## 🔧 Vue d'ensemble

Ce guide couvre la maintenance complète de la plateforme WiFi Sénégal, optimisée pour le marché africain.

## 📅 Tâches de maintenance

### Quotidiennes (5-10 minutes)
- [ ] **Vérifier les alertes de sécurité** dans le dashboard
- [ ] **Contrôler les Edge Functions logs** pour erreurs critiques
- [ ] **Surveiller le rate limiting** et ajuster si nécessaire
- [ ] **Vérifier les sessions actives** utilisateurs

### Hebdomadaires (30 minutes)
- [ ] **Analyser les métriques de performance** 
- [ ] **Nettoyer les logs d'audit** anciens (>30 jours)
- [ ] **Vérifier l'utilisation des ressources** Supabase
- [ ] **Tester les sauvegardes** automatiques
- [ ] **Mise à jour dépendances** mineures

### Mensuelles (2 heures)
- [ ] **Audit de sécurité complet**
- [ ] **Optimisation base de données** (VACUUM, ANALYZE)
- [ ] **Révision des politiques RLS**
- [ ] **Test de charge** sur les endpoints critiques
- [ ] **Mise à jour majeure** des dépendances

### Trimestrielles (1 jour)
- [ ] **Backup complet** de la base de données
- [ ] **Test de disaster recovery**
- [ ] **Audit architecture** et refactoring
- [ ] **Formation équipe** nouvelles fonctionnalités
- [ ] **Planification évolutions** futures

## 🚨 Procédures d'urgence

### Panne système
1. **Identifier** la source via logs Supabase
2. **Isoler** le composant défaillant
3. **Activer** les fallbacks automatiques
4. **Notifier** les administrateurs
5. **Documenter** l'incident

### Performance dégradée
1. **Vérifier** les métriques temps réel
2. **Identifier** les goulots d'étranglement
3. **Ajuster** le rate limiting temporairement
4. **Optimiser** les requêtes problématiques
5. **Monitorer** l'amélioration

### Sécurité compromise
1. **Bloquer** les accès suspects immédiatement
2. **Analyser** les logs d'audit complets
3. **Révoquer** les sessions compromises
4. **Informer** les utilisateurs affectés
5. **Renforcer** les mesures préventives

## 📊 Monitoring & Métriques

### Dashboards à surveiller
- **Supabase Dashboard** : Santé générale
- **Edge Functions Logs** : Performance API
- **Auth Metrics** : Sécurité authentification
- **Database Analytics** : Performance requêtes

### Seuils d'alerte
```typescript
const ALERT_THRESHOLDS = {
  apiResponseTime: 5000,      // > 5s
  errorRate: 0.01,            // > 1%
  memoryUsage: 0.8,           // > 80%
  diskSpace: 0.9,             // > 90%
  activeSessions: 10000,      // > 10k
  failedLogins: 100           // > 100/hour
};
```

### KPIs critiques
- **Uptime** : > 99.9%
- **Response Time** : < 3s moyenne
- **Error Rate** : < 0.5%
- **Security Score** : > 95%
- **User Satisfaction** : > 4.5/5

## 🛠️ Maintenance technique

### Base de données PostgreSQL
```sql
-- Nettoyage hebdomadaire
DELETE FROM admin_audit_logs WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM admin_sessions WHERE ended_at < NOW() - INTERVAL '7 days';

-- Optimisation mensuelle  
VACUUM ANALYZE admin_audit_logs;
VACUUM ANALYZE radius_sessions;
REINDEX INDEX CONCURRENTLY idx_audit_logs_date;
```

### Edge Functions
```typescript
// Monitoring performance
const logPerformance = (functionName: string, duration: number) => {
  if (duration > 5000) {
    console.warn(`⚠️ Slow function ${functionName}: ${duration}ms`);
  }
};

// Cleanup automatique
const cleanupOldLogs = async () => {
  // Nettoie les logs > 7 jours
  await supabase
    .from('function_logs')
    .delete()
    .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
};
```

### Frontend React
```typescript
// Performance monitoring
const trackPageLoad = (pageName: string, loadTime: number) => {
  if (loadTime > 3000) {
    console.warn(`⚠️ Slow page load ${pageName}: ${loadTime}ms`);
    // Envoyer métrique à monitoring
  }
};

// Memory leak detection
const monitorMemoryUsage = () => {
  if (performance.memory.usedJSHeapSize > 50 * 1024 * 1024) {
    console.warn('⚠️ High memory usage detected');
  }
};
```

## 🔒 Sécurité continue

### Audit automatisé
```sql
-- Vérifier les connexions suspectes
SELECT 
  admin_user_id,
  ip_address,
  COUNT(*) as login_attempts,
  MAX(created_at) as last_attempt
FROM admin_audit_logs 
WHERE action_type = 'login_failed'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY admin_user_id, ip_address
HAVING COUNT(*) > 5;
```

### Tests de sécurité
- **Scan vulnérabilités** automatique weekly
- **Penetration testing** mensuel
- **Security headers** validation
- **SSL/TLS** configuration check

## 📈 Évolutions & Mises à jour

### Processus de déploiement
1. **Test** en environnement de développement
2. **Validation** par l'équipe technique
3. **Backup** avant déploiement
4. **Déploiement** progressif (canary)
5. **Monitoring** post-déploiement
6. **Rollback** si problèmes détectés

### Gestion des dépendances
```json
{
  "scripts": {
    "update-check": "npm outdated",
    "update-minor": "npm update",
    "update-major": "npx npm-check-updates -u",
    "security-audit": "npm audit",
    "security-fix": "npm audit fix"
  }
}
```

## 📚 Documentation technique

### Fichiers importants
- `/docs/SECURITY_IMPLEMENTATION.md` : Détails sécurité
- `/docs/PERFORMANCE_OPTIMIZATION.md` : Optimisations
- `/docs/API_DOCUMENTATION.md` : Documentation API
- `/supabase/migrations/` : Historique base de données

### Contacts d'urgence
- **Développeur Principal** : contact technique
- **Administrateur Système** : infrastructure
- **Responsable Sécurité** : incidents sécurité
- **Support Supabase** : https://supabase.com/support

### Ressources externes
- [Supabase Status](https://status.supabase.com/)
- [Documentation Supabase](https://supabase.com/docs)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Dernière révision : 2025-08-15*  
*Version guide : 1.0*  
*Prochaine révision : 2025-09-15*