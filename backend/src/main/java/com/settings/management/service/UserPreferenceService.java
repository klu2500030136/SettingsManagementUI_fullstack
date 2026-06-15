package com.settings.management.service;

import com.settings.management.dto.request.PreferenceRequest;
import com.settings.management.dto.response.PreferenceResponse;
import com.settings.management.entity.User;
import com.settings.management.entity.UserPreference;
import com.settings.management.exception.ResourceNotFoundException;
import com.settings.management.repository.UserPreferenceRepository;
import com.settings.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserPreferenceService {
    private static final String DEFAULT_LANGUAGE_PREFERENCE = "English";
    private static final String DEFAULT_TIME_ZONE_PREFERENCE = "IST";
    private static final String DEFAULT_DASHBOARD_LAYOUT_PREFERENCE = "Standard";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    public PreferenceResponse getPreferences(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToResponse(getOrCreatePreferences(user));
    }

    public PreferenceResponse savePreferences(Integer userId, PreferenceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPreference pref = getOrCreatePreferences(user);
        
        pref.setUiTheme(request.getUiTheme());
        pref.setNotificationsEnabled(request.getNotificationsEnabled());
        pref.setLanguagePreference(valueOrDefault(request.getLanguagePreference(), pref.getLanguagePreference(), DEFAULT_LANGUAGE_PREFERENCE));
        pref.setTimeZonePreference(valueOrDefault(request.getTimeZonePreference(), pref.getTimeZonePreference(), DEFAULT_TIME_ZONE_PREFERENCE));
        pref.setDashboardLayoutPreference(valueOrDefault(request.getDashboardLayoutPreference(), pref.getDashboardLayoutPreference(), DEFAULT_DASHBOARD_LAYOUT_PREFERENCE));
        
        pref = preferenceRepository.save(pref);
        
        return mapToResponse(pref);
    }

    private UserPreference getOrCreatePreferences(User user) {
        UserPreference pref = preferenceRepository.findById(user.getUserId())
                .orElseGet(() -> {
                    UserPreference newPref = new UserPreference();
                    newPref.setUserId(user.getUserId());
                    return preferenceRepository.save(newPref);
                });

        return applyPreferenceDefaults(pref);
    }

    private PreferenceResponse mapToResponse(UserPreference pref) {
        return PreferenceResponse.builder()
                .userId(pref.getUserId())
                .uiTheme(pref.getUiTheme())
                .notificationsEnabled(pref.getNotificationsEnabled())
                .languagePreference(pref.getLanguagePreference())
                .timeZonePreference(pref.getTimeZonePreference())
                .dashboardLayoutPreference(pref.getDashboardLayoutPreference())
                .build();
    }

    private UserPreference applyPreferenceDefaults(UserPreference pref) {
        boolean changed = false;

        if (pref.getLanguagePreference() == null) {
            pref.setLanguagePreference(DEFAULT_LANGUAGE_PREFERENCE);
            changed = true;
        }

        if (pref.getTimeZonePreference() == null) {
            pref.setTimeZonePreference(DEFAULT_TIME_ZONE_PREFERENCE);
            changed = true;
        }

        if (pref.getDashboardLayoutPreference() == null) {
            pref.setDashboardLayoutPreference(DEFAULT_DASHBOARD_LAYOUT_PREFERENCE);
            changed = true;
        }

        return changed ? preferenceRepository.save(pref) : pref;
    }

    private String valueOrDefault(String requestedValue, String currentValue, String defaultValue) {
        if (requestedValue != null) {
            return requestedValue;
        }

        return currentValue != null ? currentValue : defaultValue;
    }
}
